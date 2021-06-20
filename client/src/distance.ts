/* Autor: Dennis Heuermann */

//calculates the distance between two coordinates. Accepts numbers and strings for the first position.
export function getDistance(
  lat1: number | string,
  lng1: number | string,
  lat2: number | string,
  lng2: number | string
) {
  const rad = function (x: number) {
    return (x * Math.PI) / 180;
  };

  if (typeof lat1 !== 'number') {
    lat1 = parseFloat(lat1);
  }
  if (typeof lng1 !== 'number') {
    lng1 = parseFloat(lng1);
  }
  if (typeof lat2 !== 'number') {
    lat2 = parseFloat(lat2);
  }
  if (typeof lng2 !== 'number') {
    lng2 = parseFloat(lng2);
  }

  const R = 6378137;
  const dLat = rad(lat2 - lat1);
  const dLong = rad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = (R * c) / 1000;
  return d.toFixed(1); // returns the distance in kilometer
}
