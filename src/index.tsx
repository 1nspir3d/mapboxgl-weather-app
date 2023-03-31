import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import MapboxGL from '@rnmapbox/maps';

MapboxGL.setAccessToken(
  'pk.eyJ1IjoiMW5zcGlyM2QiLCJhIjoiY2xmdWdhbzhsMDJkODNqbXU0ZXduenB4eSJ9.3gjSoGxYCmFckQ9g_JBnaA',
);
MapboxGL.setWellKnownTileServer(MapboxGL.TileServers.Mapbox);

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },

  map: {
    flex: 1,
  },
});

const App = (): JSX.Element => {
  useEffect(() => {
    MapboxGL.setTelemetryEnabled(false);
  }, []);

  return (
    <View style={styles.page}>
      <MapboxGL.MapView
        style={styles.map}
        compassEnabled={true}
        // styleURL={MapboxGL.StyleURL.Dark}
        styleJSON={JSON.stringify({
          version: 8,
          name: 'Land',
          sources: {
            map: {
              type: 'raster',
              tiles: [
                'https://b.sat.owm.io/vane/2.0/weather/TA2/{z}/{x}/{y}?appid=9de243494c0b295cca9337e1e96b00e2&fill_bound=true',
              ],
              tileSize: 256,
              minzoom: 1,
              maxzoom: 30,
            },
            background: {
              type: 'raster',
              tiles: [
                'https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
              ],
              tileSize: 256,
              minzoom: 1,
              maxzoom: 19,
            },
            cities: {
              type: 'geojson',
              data: 'https://b.maps.owm.io/weather/cities/2/0/0?appid=b1b15e88fa797225412429c1c50c122a1',
              tileSize: 256,
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
            {
              id: 'map',
              type: 'raster',
              source: 'map',
              paint: {
                'raster-fade-duration': 100,
              },
            },
            {
              id: 'cities',
              type: 'circle',
              source: 'cities',
              'circle-radius': 10,
              'circle-color': 'red',
            },
          ],
        })}>
        <MapboxGL.Camera
          defaultSettings={{
            zoomLevel: 1,
            centerCoordinate: [47.5361, 20.2456],
            pitch: 0,
          }}
        />
        <MapboxGL.Images
          images={{
            test: {
              uri: 'https://openweathermap.org/img/wn/10d@4x.png',
            },
          }}
        />
        <MapboxGL.ShapeSource
          shape={{
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [0, 0],
            },
            properties: {
              city: 'Antananarivo',
              clouds: 75,
              country: 'MG',
              humidity: 73,
              pressure: 1021,
              temp: 22.98,
              feels_like: 23.24,
              wind_deg: 90,
              wind_speed: 3.6,
            },
          }}>
          <MapboxGL.SymbolLayer
            id="test-image"
            aboveLayerID="cities"
            style={{
              iconImage: 'test',
              iconSize: 1,
            }}
          />
        </MapboxGL.ShapeSource>
      </MapboxGL.MapView>
    </View>
  );
};

export default App;
