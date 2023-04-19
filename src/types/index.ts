import {
  Feature,
  Point
} from 'geojson'

export type TFeature = Feature & {
  geometry: Point
}