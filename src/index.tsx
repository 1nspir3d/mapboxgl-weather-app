import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import { zalupaEbanaBlyat } from './utils/zalupa-ebana-blyat';
import debounce from './utils/debounce';
import { TFeature } from './types'
import Marker from './components/Marker';

MapboxGL.setAccessToken(
  'pk.eyJ1IjoiMW5zcGlyM2QiLCJhIjoiY2xmdWdhbzhsMDJkODNqbXU0ZXduenB4eSJ9.3gjSoGxYCmFckQ9g_JBnaA',
);
MapboxGL.setWellKnownTileServer(MapboxGL.TileServers.Mapbox);

const fetchWeather = async (urls: string[], setShapes: React.Dispatch<any>) => {
  const res = await Promise.all(
    urls.map(async (url) => {
      const response = await fetch(url, {
        method: 'GET',
      });

      return await response.json().then(data => data.features);
    }));
  setShapes(res.flat(1));
};

const bouncedFetch = debounce(500)(fetchWeather);

const App = (): JSX.Element => {
  const [urls, setUrls] = useState<string[] | null>(null);
  const [shapes, setShapes] = useState<TFeature[]>([]);

  useEffect(() => {
    MapboxGL.setTelemetryEnabled(false);
  }, []);

  useEffect(() => {
    if (!urls) {
      return;
    }

    bouncedFetch(urls, setShapes);
  }, [urls]);

  return (
    <View style={styles.page}>
      <MapboxGL.MapView
        rotateEnabled={false}
        pitchEnabled={false}
        style={styles.map}
        onRegionDidChange={feature => {
          setUrls(
            zalupaEbanaBlyat(
              feature.properties.visibleBounds,
              feature.properties.zoomLevel + 1,
            ),
          );
        }}
        compassEnabled={true}
        styleURL={MapboxGL.StyleURL.Dark}
      >
        <MapboxGL.Camera
          maxZoomLevel={10}
          minZoomLevel={1}
          defaultSettings={{
            zoomLevel: 1,
            centerCoordinate: [0, 0],
            pitch: 0,
          }}
        />
        {shapes.map((feature, id) => {
          if (feature?.geometry?.coordinates) {
            return <Marker feature={feature} />
          }
          return null;
        })}
      </MapboxGL.MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  map: {
    flex: 1,
  }
});

export default App;
