const { __ } = wp.i18n;
const { InspectorControls, registerBlockType } = wp.blocks;
const { Dashicon, PanelBody, Placeholder, SelectControl, Spinner, TextControl, ToggleControl } = wp.components;
const { Component, RawHTML } = wp.element;

import createFragment from 'react-addons-create-fragment';
import { addQueryArgs } from '@wordpress/url';
import SandBox from '../components/sandbox/';
import LogicControl from '../components/conditional-logic/'
import buildBlockObject from '../functions/block-builder/'

let block;
let block_object;

for ( block in pods_gutenberg.block_configs ) {
	block_object = pods_gutenberg.block_configs[ block ];

	registerBlockType( block_object.type, buildBlockObject( block_object ) );
}