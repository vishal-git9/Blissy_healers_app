export type ProfileData = {
  id: number;
  age: number;
  name: string;
  bio: string;
  imageUrl: string;
  gender: string;
  hours: string;
  ratingCount: number;
  calls: string;
  rating: number;
};
export const HealerMockData: ProfileData[] = [
  {
    name: 'Shivam Singh',
    age: 30,
    gender: 'male',
    rating: 4.5,
    id: 1,
    calls: '20',
    hours: '600',
    bio: 'Experienced healer with a passion for helping others.',
    ratingCount: 20,
    imageUrl: 'https://images.unsplash.com/photo-1534339480783-6816b68be29c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aW5kaWFuJTIwbWFsZXxlbnwwfHwwfHx8MA%3D%3D',
  },
  {
    name: 'Sheetal Khanna',
    age: 28,
    gender: 'female',
    rating: 4.2,
    hours: 'Available: 10am - 6pm',
    bio: 'Compassionate healer specializing in mental health.',
    ratingCount: 15,
    id:2,
    calls:"50",
    imageUrl: 'https://images.unsplash.com/photo-1617009762269-c062aaf6b3a0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aW5kaWFuJTIwZmVtYWxlfGVufDB8fDB8fHww',
  },
  // Add more mock data items as needed
  {
    name: 'Avadhut Sindhe',
    age: 25,
    gender: 'male',
    rating: 4.7,
    id:3,
    calls:"23",
    hours: '4000',
    bio: 'Skilled healer with expertise in alternative medicine.',
    ratingCount: 13,
    imageUrl: 'https://images.unsplash.com/flagged/photo-1571367034861-e6729ad9c2d5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aW5kaWFuJTIwbWFsZXxlbnwwfHwwfHx8MA%3D%3D',
  },
  {
    name: 'Sneha Shukla',
    age: 24,
    gender: 'female',
    rating: 4.0,
    id:4,
    calls:"30",
    hours: '1200',
    bio: 'Empathetic healer dedicated to holistic wellness.',
    ratingCount: 18,
    imageUrl: 'https://images.unsplash.com/photo-1623091411466-19dce1ed99a3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGluZGlhbiUyMGZlbWFsZXxlbnwwfHwwfHx8MA%3D%3D',
  },
  // Add more mock data items as needed
  {
    name: 'David',
    age: 30,
    id:5,
    calls:"5",
    gender: 'male',
    rating: 4.8,
    hours: '700',
    bio: 'Experienced healer specializing in physical therapy.',
    ratingCount: 3,
    imageUrl: 'https://images.unsplash.com/photo-1542190891-2093d38760f2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGluZGlhbiUyMG1hbGV8ZW58MHx8MHx8fDA%3D',
  },
  {
    name: 'Sarah Khan',
    age: 26,
    id:6,
    calls:"40",
    gender: 'female',
    rating: 4.3,
    hours: '400',
    bio: 'Knowledgeable healer focused on nutrition and wellness.',
    ratingCount: 22,
    imageUrl: 'https://images.unsplash.com/photo-1613309561345-87a0798e1d06?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGluZGlhbiUyMGZlbWFsZXxlbnwwfHwwfHx8MA%3D%3D',
  },
  // Add more mock data items as needed
];
