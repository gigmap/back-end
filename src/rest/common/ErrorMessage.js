class ErrorMessage {

  /**
   * @param {string} [code]
   * @param {Object} [data]
   */
  constructor(code, data) {
    /** @private */ this.errors = [];

    if (code) {
      this.add(code, data);
    }
  }

  /**
   * @param {string} code
   * @param {Object} [data]
   * @return {{errors: []}}
   */
  static prebuilt(code, data) {
    return new ErrorMessage(code, data).build();
  }

  /**
   * @param {string} code
   * @param {Object} [data]
   * @return {ErrorMessage}
   */
  add(code, data) {
    const error = {code};
    if (data) {
      Object.assign(error, {...data});
    }
    this.errors.push(error);

    return this;
  }

  /**
   * @return {{errors: []}}
   */
  build() {
    return {errors: this.errors.slice()};
  }
}

module.exports = ErrorMessage;