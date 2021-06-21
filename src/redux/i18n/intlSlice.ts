import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { I18nState, RootState } from '../../custom_types/redux-types';
import { LOCALES } from '../../shared/utils/constants';

const initialState: I18nState = {
  language: LOCALES.CHINESE
};

export const i18nSlice = createSlice({
  name: 'i18n',
  initialState,
  reducers: {
    changeLocale: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    }
  }
});

export const { changeLocale } = i18nSlice.actions;

export const selectLanguage = (state: RootState): string => state.i18n.language;

export default i18nSlice.reducer;
