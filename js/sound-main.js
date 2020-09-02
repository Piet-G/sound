// Copyright 2020, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Piet Goris
 */

import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
//import AlignGroup from '../../scenery/js/nodes/AlignGroup.js';
import SoundScreen from './sound/SoundScreen.js';
import soundStrings from './soundStrings.js';
import SingleSourceModel from './sound/model/SingleSourceModel.js';
import SingleSourceView from './sound/view/SingleSourceView.js';
import MeasureView from './sound/view/MeasureView.js';
import MeasureModel from './sound/model/MeasureModel.js';
import TwoSourceView from './sound/view/TwoSourceView.js';
import TwoSourceModel from './sound/model/TwoSourceModel.js';
import ReflectionView from './sound/view/ReflectionView.js';
import ReflectionModel from './sound/model/ReflectionModel.js';
import PressureView from './sound/view/PressureView.js';
import PressureModel from './sound/model/PressureModel.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import singleSourceIcon from '../images/singleSourceIcon_png.js';
import measureIcon from '../images/measureIcon_png.js';
import twoSourceIcon from '../images/twoSourceIcon_png.js';
import reflectionIcon from '../images/reflectionIcon_png.js';
import pressureIcon from '../images/pressureIcon_png.js';

const soundTitleString = soundStrings.sound.title;
const singleSourceTitle = soundStrings.singleSource.title;
const measureTitle = soundStrings.measure.title;
const twoSourceTitle = soundStrings.twoSource.title;
const reflectionTitle = soundStrings.reflection.title;
const pressureTitle = soundStrings.airPressure.title;



const simOptions = {

  //TODO fill in credits, all of these fields are optional, see joist.CreditsNode
  credits: {
    leadDesign: '',
    softwareDevelopment: '',
    team: '',
    qualityAssurance: '',
    graphicArts: '',
    soundDesign: '',
    thanks: ''
  }
};

//const alignGroup = new AlignGroup( {
  // Elements should have the same widths but not constrained to have the same heights
//  matchVertical: false
//} );

// launch the sim - beware that scenery Image nodes created outside of simLauncher.launch() will have zero bounds
// until the images are fully loaded, see https://github.com/phetsims/coulombs-law/issues/70
simLauncher.launch( () => {
/*  const screens = [
    new MediumScreen( alignGroup, {
      scenes: [ 'waterScene' ],
      name: waterString,
      homeScreenIcon: new ScreenIcon( new Image( waterScreenIcon ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      supportsSound: true
    } ),
    new MediumScreen( alignGroup, {
      scenes: [ 'soundScene' ],
      name: soundString,
      homeScreenIcon: new ScreenIcon( new Image( soundScreenIcon ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      showPlaySoundButton: true,
      supportsSound: true
    } ),
    new MediumScreen( alignGroup, {
      scenes: [ 'lightScene' ],
      name: lightString,
      homeScreenIcon: new ScreenIcon( new Image( lightScreenIcon ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      supportsSound: true
    } )
  ];*/

  const sim = new Sim( soundTitleString, [
    new SoundScreen( Tandem.ROOT.createTandem( 'soundScreen' ), singleSourceTitle, () => new SingleSourceModel(), model => new SingleSourceView(model), new Image(singleSourceIcon)),
    new SoundScreen( Tandem.ROOT.createTandem( 'soundScreen2' ), measureTitle, () => new MeasureModel(), model => new MeasureView(model), new Image(measureIcon)),
    new SoundScreen( Tandem.ROOT.createTandem( 'soundScreen3' ), twoSourceTitle, () => new TwoSourceModel(), model => new TwoSourceView(model), new Image(twoSourceIcon)),
    new SoundScreen( Tandem.ROOT.createTandem( 'soundScreen4' ), reflectionTitle, () => new ReflectionModel(), model => new ReflectionView(model), new Image(reflectionIcon)),
    new SoundScreen( Tandem.ROOT.createTandem( 'soundScreen4' ), pressureTitle, () => new PressureModel(), model => new PressureView(model), new Image(pressureIcon))
  ], simOptions );
  sim.start();
} );