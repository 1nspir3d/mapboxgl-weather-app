import React from 'react';
import MapboxGL from "@rnmapbox/maps";
import { StyleSheet, Text, View } from 'react-native';
import { TFeature } from "../types";
import getColor from '../utils/getColor';

interface Props {
  feature: TFeature
}

const Marker = ({ feature }: Props): JSX.Element => {
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

export default Marker