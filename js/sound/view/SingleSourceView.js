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

class SingleSourceView extends SoundScreenView {
  constructor(model) {
    assert && assert( model instanceof SingleSourceModel, 'invalid model' );
    super(model, Tandem.ROOT.createTandem('model'));

    const bounds = new Bounds2( 0, model.listenerPositionProperty.value.y, SoundConstants.WAVE_AREA_WIDTH, 1 );

		const child = new Image(listenerImage);
		this.listener = new MovableNode(model.listenerPositionProperty, bounds, model.modelViewTransform, child);
		child.setCenter(new Vector2(0,0));
		this.addChild(this.listener);
  }
}

sound.register( 'SingleSourceView', SingleSourceView );
export default SingleSourceView;