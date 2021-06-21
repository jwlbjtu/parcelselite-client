import axios from 'axios';
import { DEFAULT_SERVER_HOST } from './constants';

const instance = axios.create({
  baseURL: DEFAULT_SERVER_HOST
});

export default instance;
