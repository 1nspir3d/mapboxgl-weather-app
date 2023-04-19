import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import {
  Feature,
  Point
} from 'geojson'
import { zalupaEbanaBlyat } from './zalupa-ebana-blyat';
import debounce from './debounce';

type TFeature = Feature & {
  geometry: Point
}

MapboxGL.setAccessToken(
  'pk.eyJ1IjoiMW5zcGlyM2QiLCJhIjoiY2xmdWdhbzhsMDJkODNqbXU0ZXduenB4eSJ9.3gjSoGxYCmFckQ9g_JBnaA',
);
MapboxGL.setWellKnownTileServer(MapboxGL.TileServers.Mapbox);

const getColor = (temp: number): string => {
  if (temp <= 0) {
    return '#1c71f2';
  }
  if (temp <= 10) {
    return '#60bdfa';
  }
  if (temp <= 20) {
    return '#e8d024';
  }
  if (temp <= 30) {
    return '#fbaa1b';
  }
  return '#f56048';
};

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
            return buildMarker(feature);
          }
          return null;
        })}
      </MapboxGL.MapView>
    </View>
  );
};

const buildMarker = (feature: TFeature): JSX.Element => {
  return (
    <MapboxGL.MarkerView
      coordinate={feature?.geometry?.coordinates}
    >
      <View
        pointerEvents='none'
        style={[
          styles.marker,
          {
            backgroundColor: getColor(feature?.properties?.temp),
          },
        ]}>
        <View style={styles.tempContainer}>
          <Text>{Math.trunc(feature?.properties?.temp || 0)} C°</Text>
        </View>
        <Text ellipsizeMode="tail" style={styles.city}>
          {feature?.properties?.city}
        </Text>
      </View>
    </MapboxGL.MarkerView >
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },

  map: {
    flex: 1,
  },

  marker: {
    height: 20,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  tempContainer: {
    height: '100%',
    backgroundColor: 'white',
    alignSelf: 'flex-start',
    paddingHorizontal: 2,
  },
  city: {
    paddingHorizontal: 5,
  },
});

export default App;
