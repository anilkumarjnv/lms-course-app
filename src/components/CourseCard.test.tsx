import { fireEvent, render, screen } from '@testing-library/react-native';

import { CourseCard } from '@/components/CourseCard';
import { ThemeProvider } from '@/theme/ThemeProvider';
import type { Course } from '@/types/course';

const course: Course = {
  id: 'c1',
  title: 'Modern React from Scratch',
  category: 'Web Development',
  thumbnail: 'thumb',
  backdrop: 'back',
  progress: 0.3,
  duration: '8h 20m',
  level: 'Beginner',
  rating: 4.7,
  description: 'desc',
  tags: ['React'],
};

describe('CourseCard', () => {
  test('renders the title and calls onPress with the course id', () => {
    const onPress = jest.fn();
    render(
      <ThemeProvider>
        <CourseCard course={course} onPress={onPress} />
      </ThemeProvider>,
    );

    expect(screen.getByText('Modern React from Scratch')).toBeOnTheScreen();

    fireEvent.press(
      screen.getByRole('button', { name: 'Modern React from Scratch' }),
    );
    expect(onPress).toHaveBeenCalledWith('c1');
  });
});
