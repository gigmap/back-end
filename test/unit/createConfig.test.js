const {expect} = require('chai');
const {describe, it, before, afterEach} = require('mocha');

const createConfig = require('../../src/createConfig');

const DEFAULT_SONGKICK_BASE_URL = 'https://api.songkick.com/api/3.0';
const TEST_VALUE = 'test';
const DEFAULT_DAYS = 90;

const expectConfig =
  (baseUrl = DEFAULT_SONGKICK_BASE_URL, apiKey = TEST_VALUE, frontendOrigin = '') => ({
    gigmap: {frontendOrigin, maxTimePeriodDays: DEFAULT_DAYS},
    songkick: {baseUrl, apiKey}
  });

describe('createConfig', function () {

  const resetEnv = () => {
    process.env.SONGKICK_API_KEY = '';
    process.env.SONGKICK_BASE_URL = '';
    process.env.FRONTEND_ORIGIN = '';
  };

  before(resetEnv);
  afterEach(resetEnv);

  describe('production', function () {
    it('should throw if not enough vars set for production', function () {
      expect(() => createConfig(true)).to.throw(Error);
    });

    it('should not throw if all vars set for production', function () {
      process.env.SONGKICK_API_KEY = 'key';
      process.env.FRONTEND_ORIGIN = 'some';
      expect(() => createConfig(true)).not.to.throw(Error);
    });
  });

  describe('development', function () {

    it('should use URL from env', function () {
      process.env.SONGKICK_BASE_URL = 'some-url';
      expect(createConfig()).to.be.deep.equal(expectConfig('some-url'));
    });

    it('should use api key from env', function () {
      process.env.SONGKICK_BASE_URL = 'some-url';
      process.env.SONGKICK_API_KEY = 'some-key';
      expect(createConfig()).to.be.deep.equal(expectConfig('some-url', 'some-key'));
    });

    it('should use all variables from env', function () {
      process.env.SONGKICK_BASE_URL = 'some-url';
      process.env.SONGKICK_API_KEY = 'some-key';
      process.env.FRONTEND_ORIGIN = 'https://some.com';
      process.env.MAX_TIME_PERIOD = 33;


      expect(createConfig()).to.be.deep.equal({
        gigmap: {
          frontendOrigin: 'https://some.com',
          maxTimePeriodDays: 33
        },
        songkick: {
          baseUrl: 'some-url',
          apiKey: 'some-key'
        }
      });
    });
  });


});