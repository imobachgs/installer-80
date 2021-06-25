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

export function productsReducer(state, action) {
  switch (action.type) {
    case actionTypes.LOAD_PRODUCTS: {
      return { ...action.payload }
    }

    default: {
      return state;
    }
  }
}

export function languagesReducer(state, action) {
  switch (action.type) {
    case actionTypes.LOAD_LANGUAGES: {
      return { ...action.payload }
    }

    default: {
      return state;
    }
  }
}

export function disksReducer(state, action) {
  switch (action.type) {
    case actionTypes.LOAD_DISKS: {
      return { ...action.payload }
    }

    default: {
      return state;
    }
  }
}

export function optionsReducer(state, action) {
  switch (action.type) {
    case actionTypes.LOAD_OPTIONS: {
      return { ...action.payload }
    }

    default: {
      return state;
    }
  }
}