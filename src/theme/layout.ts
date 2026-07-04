/**
 * Shared layout constants.
 *
 * Card width/spacing are exported so CourseRow can provide `getItemLayout`
 * (fixed-size items) to the FlatList — a real performance win that skips async
 * layout measurement while scrolling.
 */

import { Dimensions } from 'react-native';

export const SCREEN_WIDTH = Dimensions.get('window').width;

/** Portrait course card. */
export const CARD_WIDTH = 150;
export const CARD_SPACING = 12;
/** Full slot a card occupies in a horizontal list (width + trailing gap). */
export const CARD_STRIDE = CARD_WIDTH + CARD_SPACING;
/** Portrait aspect ratio for card artwork. */
export const CARD_IMAGE_RATIO = 1.4;

/** Hero pager. */
export const HERO_HEIGHT = 230;
export const HERO_H_PADDING = 20;
