import { pickEntries } from '../pick-entries';

describe('pickEntries', () => {
  describe('basic functionality', () => {
    it('should pick simple entries', () => {
      const flatten = {
        title: 'Hello',
        description: 'World',
        author: 'John',
      };
      const pickPaths = ['title', 'description'];

      const result = pickEntries(flatten, pickPaths);

      expect(result).toEqual({
        title: 'Hello',
        description: 'World',
      });
    });

    it('should pick nested entries', () => {
      const flatten = {
        title: 'Hello',
        'metadata.author': 'John',
        'metadata.date': '2024-01-01',
      };
      const pickPaths = ['metadata'];

      const result = pickEntries(flatten, pickPaths);

      expect(result).toEqual({
        'metadata.author': 'John',
        'metadata.date': '2024-01-01',
      });
    });
  });

  describe('dynamic zone handling', () => {
    it('should handle dynamic zone entries', () => {
      const flatten = {
        'api::lesson.lesson[1].title': 'Lecture: Addition',
        'api::lesson.lesson[1].start_time': '2022-09-28T09:00:00.000Z',
        'api::lesson.lesson[1].duration': '03:00:00.000',
        'api::lesson.lesson[1].description':
          "## Description\n\nIn this lesson, we'll learn about addition and what rules to follow...",
        'api::lesson.lesson[1].lesson_type[1;lesson.lecture].__component': 'lesson.lecture',
        'api::lesson.lesson[1].lesson_type[1;lesson.lecture].content':
          'You need to follow these rules:\na) add one number to the other\nb) do not subtract nor multiply\nc) ...',
      };
      const pickPaths = [
        'api::lesson.lesson.title',
        'api::lesson.lesson.description',
        'api::lesson.lesson.lesson_type[lecture].content',
        'api::lesson.lesson.lesson_type[survey].description',
        'api::lesson.lesson.lesson_type[survey].questions.question',
        'api::lesson.lesson.lesson_type[quiz].title',
        'api::lesson.lesson.lesson_type[quiz].questions.question',
        'api::lesson.lesson.lesson_type[quiz].answers.correct_answer',
        'api::lesson.lesson.id',
      ];

      const result = pickEntries(flatten, pickPaths);

      expect(result).toEqual({
        'api::lesson.lesson[1].title': 'Lecture: Addition',
        'api::lesson.lesson[1].description':
          "## Description\n\nIn this lesson, we'll learn about addition and what rules to follow...",
        'api::lesson.lesson[1].lesson_type[1;lesson.lecture].content':
          'You need to follow these rules:\na) add one number to the other\nb) do not subtract nor multiply\nc) ...',
      });
    });

    it('should handle mixed dynamic and regular entries', () => {
      const flatten = {
        'api::lesson.lesson[1].title': 'Lecture: Addition',
        'api::lesson.lesson[1].lesson_type[1;lesson.lecture].text': 'Hello',
        'api::lesson.lesson[1].lesson_type[1;lesson.lecture].__component': 'lesson.lecture',
        'api::lesson.lesson[1].metadata.author': 'John',
      };
      const pickPaths = ['api::lesson.lesson.title', 'api::lesson.lesson.lesson_type[lecture].text'];

      const result = pickEntries(flatten, pickPaths);

      expect(result).toEqual({
        'api::lesson.lesson[1].title': 'Lecture: Addition',
        'api::lesson.lesson[1].lesson_type[1;lesson.lecture].text': 'Hello',
      });
    });
  });

  describe('array handling', () => {
    it('should handle regular array entries', () => {
      const flatten = {
        'items[0].name': 'First',
        'items[1].name': 'Second',
        other: 'value',
      };
      const pickPaths = ['items'];

      const result = pickEntries(flatten, pickPaths);

      expect(result).toEqual({
        'items[0].name': 'First',
        'items[1].name': 'Second',
      });
    });

    it('should handle nested array entries', () => {
      const flatten = {
        'data.items[0].values[0]': 'First',
        'data.items[0].values[1]': 'Second',
        'data.other': 'value',
      };
      const pickPaths = ['data.items'];

      const result = pickEntries(flatten, pickPaths);

      expect(result).toEqual({
        'data.items[0].values[0]': 'First',
        'data.items[0].values[1]': 'Second',
      });
    });
  });

  describe('special cases', () => {
    it('should filter out __component fields', () => {
      const flatten = {
        'content[0].text': 'Hello',
        'content[0].__component': 'basic.text',
        'content[1].url': 'image.jpg',
        'content[1].__component': 'basic.image',
      };
      const pickPaths = ['content'];

      const result = pickEntries(flatten, pickPaths);

      expect(result).toEqual({
        'content[0].text': 'Hello',
        'content[1].url': 'image.jpg',
      });
    });

    it('should handle JSON fields', () => {
      const flatten = {
        'config.settings.theme': 'dark',
        'config.settings.language': 'en',
        other: 'value',
      };
      const pickPaths = ['config.settings'];

      const result = pickEntries(flatten, pickPaths);

      expect(result).toEqual({
        'config.settings.theme': 'dark',
        'config.settings.language': 'en',
      });
    });

    it('should handle empty input', () => {
      expect(pickEntries({}, [])).toEqual({});
      expect(pickEntries({}, ['some.path'])).toEqual({});
      expect(pickEntries({ key: 'value' }, [])).toEqual({});
    });
  });

  describe('edge cases', () => {
    it('should handle paths with special characters', () => {
      const flatten = {
        'special-key.value': 'test',
        'normal.key': 'value',
      };
      const pickPaths = ['special-key'];

      const result = pickEntries(flatten, pickPaths);

      expect(result).toEqual({
        'special-key.value': 'test',
      });
    });

    it('should handle multiple dynamic zones', () => {
      const flatten = {
        'api::lesson.lesson[1].lesson_type[1;lesson.lecture].content': 'Lecture content',
        'api::lesson.lesson[1].lesson_type[1;lesson.lecture].__component': 'lesson.lecture',
        'api::lesson.lesson[1].attachments[1;lesson.file].url': 'file.pdf',
        'api::lesson.lesson[1].attachments[1;lesson.file].__component': 'lesson.file',
      };
      const pickPaths = ['api::lesson.lesson.lesson_type[lecture].content', 'api::lesson.lesson.attachments[file].url'];

      const result = pickEntries(flatten, pickPaths);

      expect(result).toEqual({
        'api::lesson.lesson[1].lesson_type[1;lesson.lecture].content': 'Lecture content',
        'api::lesson.lesson[1].attachments[1;lesson.file].url': 'file.pdf',
      });
    });
  });
});
