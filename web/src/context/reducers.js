/*
 * Copyright (c) [2021] SUSE LLC
 *
 * All Rights Reserved.
 *
 * This program is free software; you can redistribute it and/or modify it
 * under the terms of version 2 of the GNU General Public License as published
 * by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for
 * more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, contact SUSE LLC.
 *
 * To contact SUSE LLC about this file by physical or electronic mail, you may
 * find current contact information at www.suse.com.
 */

import actionTypes from './actionTypes';

export function softwareReducer(state, action) {
  switch (action.type) {
    case actionTypes.LOAD_PRODUCTS: {
      return { ...action.payload }
    }

    case actionTypes.SET_OPTIONS: {
      return { ...state, product: (action.payload.product || state.product) }
    }

    default: {
      return state;
    }
  }
}

export function l10nReducer(state, action) {
  switch (action.type) {
    case actionTypes.LOAD_LANGUAGES: {
      return { ...state, languages: action.payload }
    }

    case actionTypes.SET_OPTIONS: {
      return { ...state, language: (action.payload.language || state.language) }
    }

    default: {
      return state;
    }
  }
}

export function storageReducer(state, action) {
  switch (action.type) {
    case actionTypes.LOAD_DEVICES: {
      return { ...state, devices: action.payload }
    }

    case actionTypes.SET_OPTIONS: {
      return { ...state, device: (action.payload.device || state.device) }
    }

    default: {
      return state;
    }
  }
}
