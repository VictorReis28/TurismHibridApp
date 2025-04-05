import { getDistance } from 'geolib';
import type { Location } from 'expo-location';

export interface Attraction {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  reviews: number;
  category: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export const categories = [
  'Todos',
  'Monumentos',
  'Museus',
  'Natureza',
  'Religiosos',
  'Parques',
  'Arquitetura',
];

export const attractions: Attraction[] = [
  {
    id: '1',
    name: 'Torre Eiffel',
    description:
      'Ícone mundial em Paris, França. Esta torre de ferro de 324 metros oferece vistas panorâmicas deslumbrantes da cidade luz.',
    image:
      'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=800&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviews: 145367,
    category: 'Monumentos',
    coordinates: {
      latitude: 48.8584,
      longitude: 2.2945,
    },
  },
  {
    id: '2',
    name: 'Taj Mahal',
    description:
      'Magnífico mausoléu de mármore branco em Agra, Índia. Um símbolo eterno de amor construído pelo imperador Shah Jahan.',
    image:
      'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviews: 89234,
    category: 'Arquitetura',
    coordinates: {
      latitude: 27.1751,
      longitude: 78.0421,
    },
  },
  {
    id: '3',
    name: 'Machu Picchu',
    description:
      'Antiga cidade inca nas montanhas do Peru. Uma maravilha arqueológica que revela os mistérios de uma civilização perdida.',
    image:
      'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviews: 76543,
    category: 'Arquitetura',
    coordinates: {
      latitude: -13.1631,
      longitude: -72.545,
    },
  },
  {
    id: '4',
    name: 'Grande Muralha da China',
    description:
      'Impressionante estrutura de defesa com mais de 21.000 km de extensão. Uma das maiores obras arquitetônicas da humanidade.',
    image:
      'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviews: 98765,
    category: 'Monumentos',
    coordinates: {
      latitude: 40.4319,
      longitude: 116.5704,
    },
  },
  {
    id: '5',
    name: 'Petra',
    description:
      'Cidade antiga esculpida em rocha rosa na Jordânia. Um tesouro arqueológico com arquitetura única no mundo.',
    image:
      'https://images.unsplash.com/photo-1579606037885-46c266712e4e?w=800&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviews: 45678,
    category: 'Arquitetura',
    coordinates: {
      latitude: 30.3285,
      longitude: 35.4444,
    },
  },
  {
    id: '6',
    name: 'Coliseu',
    description:
      'Anfiteatro romano histórico no coração da Itália. Palco de grandes espetáculos da antiguidade.',
    image:
      'https://images.unsplash.com/photo-1552432552-06c0b0a94dda?w=800&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviews: 112345,
    category: 'Monumentos',
    coordinates: {
      latitude: 41.8902,
      longitude: 12.4922,
    },
  },
  {
    id: '7',
    name: 'Cristo Redentor',
    description:
      'Estátua art déco de 38 metros no Rio de Janeiro. Símbolo do Brasil e uma das Novas Maravilhas do Mundo.',
    image:
      'https://images.unsplash.com/photo-1593995863951-57c27e518295?w=800&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviews: 89123,
    category: 'Monumentos',
    coordinates: {
      latitude: -22.9519,
      longitude: -43.2105,
    },
  },
  {
    id: '8',
    name: 'Santorini',
    description:
      'Ilha grega com vilas brancas sobre penhascos vulcânicos. Destino romântico com pôr do sol espetacular.',
    image:
      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviews: 67890,
    category: 'Natureza',
    coordinates: {
      latitude: 36.3932,
      longitude: 25.4615,
    },
  },
  {
    id: '9',
    name: 'Angkor Wat',
    description:
      'Maior complexo religioso do mundo no Camboja. Templos hindus-budistas com arquitetura khmer impressionante.',
    image:
      'https://images.unsplash.com/photo-1600136842913-21fb2fc6435f?w=800&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviews: 56789,
    category: 'Religiosos',
    coordinates: {
      latitude: 13.4125,
      longitude: 103.867,
    },
  },
  {
    id: '10',
    name: 'Grand Canyon',
    description:
      'Formação geológica espetacular no Arizona, EUA. Desfiladeiros coloridos esculpidos pelo Rio Colorado.',
    image:
      'https://images.unsplash.com/photo-1615551043360-33de8b5f410c?w=800&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviews: 123456,
    category: 'Natureza',
    coordinates: {
      latitude: 36.0544,
      longitude: -112.1401,
    },
  },
  {
    id: '11',
    name: 'Sagrada Família',
    description:
      'Basílica única em Barcelona, projetada por Gaudí. Obra-prima da arquitetura modernista ainda em construção.',
    image:
      'https://images.unsplash.com/photo-1583779457094-ab6c9ab30b13?w=800&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviews: 98765,
    category: 'Religiosos',
    coordinates: {
      latitude: 41.4036,
      longitude: 2.1744,
    },
  },
  {
    id: '12',
    name: 'Monte Fuji',
    description:
      'Vulcão sagrado e símbolo do Japão. Pico nevado com vista deslumbrante e importância cultural.',
    image:
      'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?w=800&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviews: 78901,
    category: 'Natureza',
    coordinates: {
      latitude: 35.3606,
      longitude: 138.7274,
    },
  },
  {
    id: '13',
    name: 'Pirâmides de Gizé',
    description:
      'Monumentos funerários do Antigo Egito. Única das Sete Maravilhas do Mundo Antigo que sobreviveu.',
    image:
      'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=800&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviews: 67890,
    category: 'Monumentos',
    coordinates: {
      latitude: 29.9792,
      longitude: 31.1342,
    },
  },
  {
    id: '14',
    name: 'Mauna Kea',
    description:
      'Vulcão adormecido no Havaí. Local sagrado e centro de observação astronômica.',
    image:
      'https://images.unsplash.com/photo-1572815178473-4a0c79a6e803?w=800&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviews: 45678,
    category: 'Natureza',
    coordinates: {
      latitude: 19.8207,
      longitude: -155.4681,
    },
  },
  {
    id: '15',
    name: 'Palácio de Versalhes',
    description:
      'Residência real francesa do século XVII. Símbolo do absolutismo e jardins magníficos.',
    image:
      'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=800&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviews: 89012,
    category: 'Arquitetura',
    coordinates: {
      latitude: 48.8048,
      longitude: 2.1203,
    },
  },
];

export function calculateDistance(
  userLocation: Location | null,
  attraction: Attraction
): number {
  if (!userLocation) return 0;

  const distance = getDistance(
    {
      latitude: userLocation.coords.latitude,
      longitude: userLocation.coords.longitude,
    },
    attraction.coordinates
  );

  // Convert meters to kilometers and round to 1 decimal place
  return Math.round((distance / 1000) * 10) / 10;
}
