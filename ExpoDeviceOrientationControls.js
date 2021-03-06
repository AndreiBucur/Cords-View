import Expo from 'expo';

const { DeviceMotion } = Expo.DangerZone;
/**
 * @author richt / http://richt.me
 * @author WestLangley / http://github.com/WestLangley
 *
 * W3C Device Orientation control (http://w3c.github.io/deviceorientation/spec-source-orientation.html)
 */

import { THREE } from 'expo-three';

import "three";
import "react-native-console-time-polyfill";
import "text-encoding";
import "xmldom-qsa";

THREE.DeviceOrientationControls = function(object) {
  var scope = this;

  this.object = object;
  this.object.rotation.reorder('YXZ');

  this.enabled = true;

  this.deviceOrientation = {};
  this.screenOrientation = 0;

  this.alphaOffset = 0; // radians

  // The angles alpha, beta and gamma form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''

  var setObjectQuaternion = (function() {
    var zee = new THREE.Vector3(0, 0, 1);

    var euler = new THREE.Euler();

    var q0 = new THREE.Quaternion();

    var q1 = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)); // - PI/2 around the x-axis

    return function(quaternion, alpha, beta, gamma, orient) {
      euler.set(beta, alpha, -gamma, 'YXZ'); // 'ZXY' for the device, but 'YXZ' for us

      quaternion.setFromEuler(euler); // orient the device

      quaternion.multiply(q1); // camera looks out the back of the device, not the top

      quaternion.multiply(q0.setFromAxisAngle(zee, orient)); // adjust for screen orientation
    };
  })();

  this.connect = function() {
    // onScreenOrientationChangeEvent(); // run once on load

    DeviceMotion.addListener(
      ({
        acceleration,
        accelerationIncludingGravity,
        rotation,
        rotationRate,
        orientation,
      }) => {
        scope.screenOrientation = orientation || 0;
        console.log(orientation);
        scope.deviceOrientation = rotation;
        scope.update();
      },
    );
    // window.addEventListener(
    //   'orientationchange',
    //   onScreenOrientationChangeEvent,
    //   false,
    // );
    // window.addEventListener(
    //   'deviceorientation',
    //   onDeviceOrientationChangeEvent,
    //   false,
    // );

    scope.enabled = true;
  };

  this.disconnect = function() {
    /// This should just remove a single instance
    DeviceMotion.removeAllListeners();

    // window.removeEventListener(
    //   'orientationchange',
    //   onScreenOrientationChangeEvent,
    //   false,
    // );
    // window.removeEventListener(
    //   'deviceorientation',
    //   onDeviceOrientationChangeEvent,
    //   false,
    // );

    scope.enabled = false;
  };

  this.update = function() {
    if (scope.enabled === false) return;

    var alpha = scope.deviceOrientation.alpha
      ? scope.deviceOrientation.alpha + this.alphaOffset
      : 0; // Z
    var beta = scope.deviceOrientation.beta ? scope.deviceOrientation.beta : 0; // X'
    var gamma = scope.deviceOrientation.gamma
      ? scope.deviceOrientation.gamma
      : 0; // Y''
    var orient = scope.screenOrientation
      ? THREE.Math.degToRad(scope.screenOrientation)
      : 0; // O

    setObjectQuaternion(scope.object.quaternion, alpha, beta, gamma, orient);
  };

  this.dispose = function() {
    this.disconnect();
  };

  this.connect();
};