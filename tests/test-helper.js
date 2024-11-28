import Application from '../app';
import config from '../config/environment';
import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-mocha';
import chai from 'chai';
import chaiDom from 'chai-dom';
setApplication(Application.create(config.APP));
chai.use(chaiDom);

start();
