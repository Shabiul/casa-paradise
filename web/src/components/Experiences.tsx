'use client';

import Attractions from './attractions/Attractions';
export { ATTRACTIONS_DATA } from './attractions/attractionData';
export type { Attraction } from './attractions/attractionData';

export default function Experiences() {
  return <Attractions />;
}
