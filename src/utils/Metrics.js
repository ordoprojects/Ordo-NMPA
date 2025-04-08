import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const hs = (size) => (width / guidelineBaseWidth) * size;
const vs = (size) => (height / guidelineBaseHeight) * size;
const ms = (size, factor = 0.5) => size + (hs(size) - size) * factor;

export { hs, vs, ms };