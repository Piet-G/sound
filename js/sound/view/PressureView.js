// Copyright 2020, University of Colorado Boulder

/**
 * @author Piet Goris
 */

import SoundScreenView from './SoundScreenView.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import sound from '../../sound.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import SingleSourceModel from '../model/SingleSourceModel.js';
import Image from '../../../../scenery/js/nodes/Image.js';

import listenerImage from '../../../images/girl_png.js';
import MovableNode from '../../common/view/MovableNode.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import SoundConstants from '../../common/SoundConstants.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import AirDensityControlPanel from '../../common/AirDensityControlPanel.js';
import Color from '../../../../scenery/js/util/Color.js';

class SingleSourceView extends SoundScreenView {
  constructor(model) {
    assert && assert( model instanceof SingleSourceModel, 'invalid model' );
    super(model, Tandem.ROOT.createTandem('model'));

    const center = model.modelViewTransform.modelToViewPosition(model.listenerPosition);
	this.listener = new Image(listenerImage);
	this.listener.setCenter(center);
	this.addChild(this.listener);



	this.pressureControlPanel = new AirDensityControlPanel(model, this.contolPanelAlignGroup);
	const updateAirDensistyPanelPosition = () => {
		this.pressureControlPanel.mutate( {
          right: this.layoutBounds.right - 8,
          top: this.audioControlPanel.bottom + 7
        } );
      };
      updateAirDensistyPanelPosition();
     this.addChild(this.pressureControlPanel);
  }
}

sound.register( 'SingleSourceView', SingleSourceView );
export default SingleSourceView;