import { Position } from '@rnmapbox/maps/lib/typescript/types/Position';

const buildUrl = (z: number, x: number, y: number): string => {
  return `https://b.maps.owm.io/weather/cities/${z}/${x}/${y}?appid=b1b15e88fa797225412429c1c50c122a1`;
};

export const zalupaEbanaBlyat = (
  bounds: Position[],
  zoom: number,
): string[] => {
  const poweredToZoom = Math.pow(2, Math.trunc(zoom));
  const maxTileXY = poweredToZoom - 1;
  const [ne, sw] = bounds;

  const NELon = ne[0] > 180 ? ne[0] - 360 : ne[0];
  const SWLon = sw[0] > 180 ? sw[0] - 360 : sw[0];

  const sinLatNE = Math.sin(ne[1] * (Math.PI / 180));
  const pixelXNE = ((NELon + 180) / 360) * 256 * poweredToZoom;
  const pixelYNE =
    (0.5 - Math.log((1 + sinLatNE) / (1 - sinLatNE)) / (4 * Math.PI)) *
    256 *
    poweredToZoom;

  const sinLatSW = Math.sin(sw[1] * (Math.PI / 180));
  const pixelXSW = ((SWLon + 180) / 360) * 256 * poweredToZoom;
  const pixelYSW =
    (0.5 - Math.log((1 + sinLatSW) / (1 - sinLatSW)) / (4 * Math.PI)) *
    256 *
    poweredToZoom;

  const range = [
    [
      Math.min(Math.floor(pixelXNE / 256), maxTileXY),
      Math.min(Math.floor(pixelYNE / 256), maxTileXY),
    ],
    [
      Math.min(Math.floor(pixelXSW / 256), maxTileXY),
      Math.min(Math.floor(pixelYSW / 256), maxTileXY),
    ],
  ];

  const urls = [];

  for (let x = range[1][0]; x <= range[0][0]; x++) {
    for (let y = range[0][1]; y <= range[1][1]; y++) {
      urls.push(buildUrl(Math.trunc(zoom), x, y));
    }
  }
  return urls;
};
