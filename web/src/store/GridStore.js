import Cell from '@/models/Cell.js';

export const SET_FOCUS = 'SET_FOCUS';
export const SET_CELLS = 'SET_CELLS';
export const SET_VALUE = 'SET_VALUE';

export const VALID = '530070000600195000098000060800060003400803001700020006060000280000419005000080079';

export default {
  namespaced: true,
  state: {
    focusedCellIndex: null,
    gridSize: null,
    cells: [],
  },
  getters: {
    isCellFocused: (state) => (cellIndex) => {
      return cellIndex === state.focusedCellIndex;
    },
    getFocusedCell: (state) => {
      return state.cells[state.focusedCellIndex];
    },
    getFocusedCellRow: (state) => {
      return Math.floor(state.focusedCellIndex / 9);
    },
    getFocusedCellCol: (state) => {
      return Math.floor(state.focusedCellIndex % 9);
    },
    getCells: (state) => {
      return state.cells;
    },
    getQueryString: (state) => {
      return state.cells.map((cell) => `${cell.value}`).join('');
    },
  },
  mutations: {
    [SET_FOCUS](state, { cellIndex }) {
      console.log('FocusedCellIndex: ' + cellIndex);
      state.focusedCellIndex = cellIndex;
    },
    [SET_CELLS](state, { cells, gridSize }) {
      state.cells = cells;
      state.gridSize = gridSize;
    },
    [SET_VALUE](state, { value }) {
      state.cells[state.focusedCellIndex].value = parseInt(value);
    },
  },
  actions: {
    setFocus({ commit }, cellIndex) {
      commit({
        type: SET_FOCUS,
        cellIndex,
      });
    },

    moveFocus({ commit, getters }, direction) {
      let newRow = getters.getFocusedCellRow;
      let newCol = getters.getFocusedCellCol;
      switch (direction) {
        case 'left':
          newCol = (newCol + 8) % 9;
          break;
        case 'right':
          newCol = (newCol + 1) % 9;
          break;
        case 'up':
          newRow = (newRow + 8) % 9;
          break;
        case 'down':
          newRow = (newRow + 1) % 9;
      }

      const cellIndex = (newRow * 9) + newCol;

      commit({
        type: SET_FOCUS,
        cellIndex,
      });
    },

    setCellValue({ commit, getters }, event) {
      if (getters.getFocusedCell.locked) {
        return;
      }

      if (event.keyCode >= 48 && event.keyCode <= 57) {
        commit({
          type: SET_VALUE,
          value: event.key,
        });
      }
      if (event.key === 'Delete' || event.key === 'Backspace') {
        commit({
          type: SET_VALUE,
          value: 0,
        });
      }
      if (event.key === 'a') {
        console.log(getters.getQueryString);
      }
    },

    loadInitialGrid({ commit }, { gridSize, grid }) {
      const gridValues = grid.split('');
      const cellCount = gridSize * gridSize;
      const cells = Array.from({ length: cellCount }, (_, index) => {
        const value = gridValues[index] ?? Math.floor(Math.random() * (gridSize + 1));
        const intValue = parseInt(value);
        return new Cell(index, intValue, gridSize, intValue > 0);
      });

      commit({
        type: SET_CELLS,
        cells,
        gridSize,
      });
    },
  },
};
