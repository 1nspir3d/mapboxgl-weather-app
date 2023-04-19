import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import { zalupaEbanaBlyat } from './zalupa-ebana-blyat';
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

const App = (): JSX.Element => {
  const [urls, setUrls] = useState<string[] | null>(null);
  const [shapes, setShapes] = useState<any>([]);
  console.log('shapes: ', shapes.length);
  useEffect(() => {
    MapboxGL.setTelemetryEnabled(false);
  }, []);

  useEffect(() => {
    if (!urls) {
      return;
    }

    Promise.all(
      urls.map(async url => {
        const data = await fetch(url, {
          method: 'GET',
        });
        return await data.json().then(data => data.features);
      }),
    ).then(res => setShapes(res.flat(1)));
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
              feature.properties.zoomLevel,
            ),
          );
        }}
        compassEnabled={true}
        // styleURL={MapboxGL.StyleURL.Dark}
        styleJSON={JSON.stringify({
          version: 8,
          name: 'Land',
          sources: {
            background: {
              type: 'raster',
              tiles: [
                'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
              ],
              tileSize: 256,
              minzoom: 1,
              maxzoom: 10,
            },
          },
          layers: [
            {
              id: 'background',
              type: 'raster',
              source: 'background',
              paint: {
                'raster-fade-duration': 100,
              },
            },
          ],
        })}>
        <MapboxGL.Camera
          maxZoomLevel={10}
          minZoomLevel={1}
          defaultSettings={{
            zoomLevel: 1,
            centerCoordinate: [0, 0],
            pitch: 0,
          }}
        />
        {shapes.map((feature, id) => (
          <MapboxGL.ShapeSource id={feature?.properties?.city} shape={feature}>
            <MapboxGL.CircleLayer
              id={`${feature?.properties?.city}-marker`}
              aboveLayerID="background"
              style={{
                circleRadius: 20,
                circleColor: getColor(feature.properties.temp),
                circleStrokeColor: 'white',
                circleStrokeWidth: 2,
              }}>
              <MapboxGL.SymbolLayer
                id={`${feature?.properties?.city}-label`}
                aboveLayerID="background"
                style={{
                  textField: 'ZALUPA',
                  textColor: 'green',
                  textSize: 12,
                  textAllowOverlap: true,
                  textIgnorePlacement: true,
                }}
              />
            </MapboxGL.CircleLayer>
          </MapboxGL.ShapeSource>
        ))}
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
  },
});

export default App;
