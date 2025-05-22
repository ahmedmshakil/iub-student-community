
export const UNIVERSITY_NAME = "Independent University, Bangladesh";
export const UNIVERSITY_SHORT_NAME = "IUB";
export const STUDENT_EMAIL_DOMAIN = "iub.edu.bd";

export const MOCK_COURSES = [
  { id: 'cse101', name: 'Introduction to Computer Science', code: 'CSE101' },
  { id: 'bus201', name: 'Principles of Business', code: 'BUS201' },
  { id: 'eng102', name: 'Composition II', code: 'ENG102' },
  { id: 'mat203', name: 'Calculus and Analytical Geometry', code: 'MAT203' },
];

export const MOCK_PRODUCTS = [
  { id: 'p1', name: 'Used Graphics Calculator', description: 'Slightly used TI-84 Plus calculator, perfect for math and engineering courses.', price: 50, imageUrl: 'https://picsum.photos/seed/calc/300/200', seller: { id: 's1', name: 'Jane Doe', studentId: '1810001', email: 'jane@example.com' }, postDate: new Date(Date.now() - 86400000 * 2), category: 'Electronics' },
  { id: 'p2', name: 'Organic Chemistry Textbook', description: '8th Edition, good condition with some highlights.', price: 30, imageUrl: 'https://picsum.photos/seed/book/300/200', seller: { id: 's2', name: 'John Smith', studentId: '1920002', email: 'john@example.com' }, postDate: new Date(Date.now() - 86400000 * 5), category: 'Books' },
  { id: 'p3', name: 'Acoustic Guitar', description: 'Beginner acoustic guitar, comes with a soft case.', price: 80, imageUrl: 'https://picsum.photos/seed/guitar/300/200', seller: { id: 's3', name: 'Alice Brown', studentId: '1730003', email: 'alice@example.com' }, postDate: new Date(Date.now() - 86400000 * 1), category: 'Musical Instruments' },
  { id: 'p4', name: 'Mini Fridge', description: 'Compact mini fridge, great for dorm rooms.', price: 60, imageUrl: 'https://picsum.photos/seed/fridge/300/200', seller: { id: 's1', name: 'Jane Doe', studentId: '1810001', email: 'jane@example.com' }, postDate: new Date(Date.now() - 86400000 * 10), category: 'Appliances' },
];
