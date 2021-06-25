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

import React from 'react';
import { disksReducer, languagesReducer, productsReducer, optionsReducer } from './reducers';
import useRootReducer from 'use-root-reducer';
import InstallerClient from '../lib/InstallerClient';
import actionTypes from './actionTypes';

const InstallerStateContext = React.createContext();
const InstallerDispatchContext = React.createContext();

function useInstallerState() {
  const context = React.useContext(InstallerStateContext);
  if (!context) {
    throw new Error('useInstallerState must be used within a InstallerProvider');
  }

  return context;
}

function useInstallerDispatch() {
  const context = React.useContext(InstallerDispatchContext);
  if (!context) {
    throw new Error('useInstallerDispatch must be used within a InstallerProvider');
  }

  return context;
}


function InstallerProvider({ children }) {
  const [state, dispatch] = useRootReducer({
    disks: React.useReducer(disksReducer, []),
    languages: React.useReducer(languagesReducer, []),
    products: React.useReducer(productsReducer, []),
    options: React.useReducer(optionsReducer, [])
  });

  return (
    <InstallerStateContext.Provider value={state}>
      <InstallerDispatchContext.Provider value={dispatch}>
        {children}
      </InstallerDispatchContext.Provider>
    </InstallerStateContext.Provider>
  );
}

function loadProducts(dispatch) {
  installerClient().getProducts().then(products => {
    dispatch({ type: actionTypes.LOAD_PRODUCTS, payload: products })
  }).catch(console.error);
}

function loadLanguages(dispatch) {
  installerClient().getLanguages().then(languages => {
    dispatch({ type: actionTypes.LOAD_LANGUAGES, payload: languages })
  }).catch(console.error);
}

function loadDisks(dispatch) {
  installerClient().getDisks().then(disks => {
    dispatch({ type: actionTypes.LOAD_DISKS, payload: disks })
  }).catch(console.error);
}

function loadOptions(dispatch) {
  installerClient().getDisks().then(options => {
    dispatch({ type: actionTypes.LOAD_OPTIONS, payload: options })
  }).catch(console.error);
}

function setOptions(opts) {
  console.log("OPTS=", opts);
  installerClient().setOptions(opts);
}

/**
 * FIXME: needed to use a function in order to delay building the object and
 * make the tests to work
 */
let _installerClient;
const installerClient = () => {
    if (_installerClient) return _installerClient;

    _installerClient = new InstallerClient('http://localhost:3000');
    return _installerClient;
};

export {
  InstallerProvider,
  useInstallerState,
  useInstallerDispatch,
  loadDisks,
  loadLanguages,
  loadProducts,
  loadOptions,
  setOptions
};
