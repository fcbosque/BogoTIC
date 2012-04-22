var Feature = require('vows-bdd').Feature,
    Zombie = require('zombie'),
    assert = require('assert'),
    app = require('../../server');

Feature('Client Side: Testing Index')
  .scenario('Loading the Home')
  .given('a client', function () {
    this.callback(null, new Zombie());
  })
  .when('go to localhost:3000/', function (browser) {
    browser.visit('http://localhost:3000/', this.callback);
  })
  .then('should get 200', function (err, browser, status) {
    assert.isNull(err);
    assert.isObject(browser);
    assert.equal(status, 200);
  })
  .and('we will see title of BogoTIC', function (err, browser) {
    assert.isNull(err);
    assert.ok(browser);
    assert.equal(browser.text('title'), 'Foros BogoTIC');
  })
  .and('we see 2 boxes', function (err, browser) {
    assert.isNull(err);
    assert.ok(browser);
    assert.isArray(browser.queryAll('h2'));
    assert.ok(browser.queryAll('h2').length === 2);
    assert.equal(browser.text('h2'), "Bienvenido a los foros de BogoTIC¿Desea participar?");
  })
  .and('we see the create user button', function (err, browser) {
    assert.isNull(err);
    assert.ok(browser);
    assert.equal(browser.text(".box-inner a[href='/usuarios/nuevo']"), "Crear cuenta nueva. »");
    assert.equal(browser.query(".box-inner a[href='/usuarios/nuevo']").getAttribute('class'), 'btn btn-primary btn-large');
  })
  .and('we see the hero-unit box', function (err, browser) {
    assert.isNull(err);
    assert.ok(browser);
    assert.ok(browser.query('.hero-unit'));
  })
  .and('we see the more info button', function (err, browser) {
    assert.isNull(err);
    assert.ok(browser);
    assert.equal(browser.text('.hero-unit .span6 a'), 'Conoce más »')
    assert.equal(browser.query('.hero-unit .span6 a').getAttribute('class'), 'btn btn-primary btn-large');
  })
  .complete()
  .finish(module);
  
