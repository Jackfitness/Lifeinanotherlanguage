import type { Reading } from '../types';

/** Tiny reading passages for brand-new readers. The first option is right. */
const R = (id: string, unit: number, text: string, q: Reading['q'], options: Reading['options']): Reading => ({ id, unit, text, q, options });

export const INK_READINGS: Reading[] = [
  R('ir_1', 1, 'あお い かさ。', { en: 'What is blue?', es: '¿Qué es azul?' },
    [{ en: 'An umbrella', es: 'Un paraguas' }, { en: 'A house', es: 'Una casa' }, { en: 'Sushi', es: 'Sushi' }, { en: 'The morning', es: 'La mañana' }]),
  R('ir_2', 2, 'ねこ と いぬ と はな。', { en: 'Which animals are there?', es: '¿Qué animales hay?' },
    [{ en: 'A cat and a dog', es: 'Un gato y un perro' }, { en: 'A fish and a cat', es: 'Un pez y un gato' }, { en: 'Two dogs', es: 'Dos perros' }, { en: 'A monkey', es: 'Un mono' }]),
  R('ir_3', 3, 'よる、 やま に ゆき。', { en: 'What is on the mountain?', es: '¿Qué hay en la montaña?' },
    [{ en: 'Snow, at night', es: 'Nieve, de noche' }, { en: 'Rain, in the morning', es: 'Lluvia, por la mañana' }, { en: 'A monkey', es: 'Un mono' }, { en: 'Flowers', es: 'Flores' }]),
  R('ir_4', 4, 'きょう の ごはん： りんご と おちゃ。', { en: "What is today's meal?", es: '¿Cuál es la comida de hoy?' },
    [{ en: 'An apple and green tea', es: 'Una manzana y té verde' }, { en: 'Sushi and coffee', es: 'Sushi y café' }, { en: 'Cake and ice cream', es: 'Pastel y helado' }, { en: 'Rice and fish', es: 'Arroz y pescado' }]),
  R('ir_5', 5, 'カフェ： アイス、 ケーキ、 ココア。', { en: 'Which is on the café board?', es: '¿Qué hay en la pizarra del café?' },
    [{ en: 'Hot chocolate', es: 'Chocolate caliente' }, { en: 'Ramen', es: 'Ramen' }, { en: 'Bread', es: 'Pan' }, { en: 'Coffee', es: 'Café' }]),
  R('ir_6', 6, 'メニュー： コーヒー、 パン、 ラーメン。', { en: 'Which is NOT on the menu?', es: '¿Qué NO está en el menú?' },
    [{ en: 'Cake', es: 'Pastel' }, { en: 'Coffee', es: 'Café' }, { en: 'Bread', es: 'Pan' }, { en: 'Ramen', es: 'Ramen' }]),
  R('ir_7', 7, '{山|やま} ^に {雨|あめ}、 {川|かわ} ^に {水|みず}。', { en: 'Where is the rain?', es: '¿Dónde está la lluvia?' },
    [{ en: 'On the mountain', es: 'En la montaña' }, { en: 'In the river', es: 'En el río' }, { en: 'On the rice field', es: 'En el arrozal' }, { en: 'Under the tree', es: 'Bajo el árbol' }]),
  R('ir_8', 8, '{森|もり} ^の {中|なか} ^で {人|ひと} ^が {休|やす}む。', { en: 'Where is the person resting?', es: '¿Dónde descansa la persona?' },
    [{ en: 'In the forest', es: 'En el bosque' }, { en: 'On the mountain', es: 'En la montaña' }, { en: 'Above the river', es: 'Sobre el río' }, { en: 'In a big house', es: 'En una casa grande' }]),
];
