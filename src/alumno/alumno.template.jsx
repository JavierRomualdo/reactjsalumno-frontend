import React from "react";
import FormularioAlumno from "./formularioAlumno";
import ListaAlumnos from "./listaAlumnos";

import {Query} from 'react-apollo';
import gql from "graphql-tag";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

// open layers
import 'ol/ol.css';
import OSM from 'ol/source/OSM';

import Feature from 'ol/Feature.js';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import Point from 'ol/geom/Point.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import VectorSource from 'ol/source/Vector.js';
import {Icon, Style} from 'ol/style.js';
import {fromLonLat} from 'ol/proj';

import estilos from './estilo.module.css';
const GET_ALUMNOS = gql`
query GetAlumnos{
  alumnos{
    id
    nombre
    edad
    sexo
    longitud
    latitud
  }
}
`;

class Alumno extends React.Component {
    constructor(props) {
        super(props);
        this.state = {id: null, nombre: '', edad: '', sexo: '',
        longitud: "", latitud: "", actualizar: false};
        this.onChangePropiedadAlumno = this.onChangePropiedadAlumno.bind(this);
        this.cambiarAModoActualizacion = this.cambiarAModoActualizacion.bind(this);
        this.cambiarAModoIngreso = this.cambiarAModoIngreso.bind(this);
        this.verUbicacionAlumno = this.verUbicacionAlumno.bind(this);
        this.map = null;
        this.marcador = null;
        this.iconFeature = null;
    }

    onChangePropiedadAlumno(e) {
        this.setState({[e.target.name]:e.target.value});
    }

    cambiarAModoActualizacion(alumno) {
        console.log(alumno);
        this.setState({id: alumno.id, nombre: alumno.nombre, edad: alumno.edad, sexo: alumno.sexo,
            longitud: alumno.longitud || '', latitud: alumno.latitud || '', actualizar: true});
    }

    cambiarAModoIngreso() {
        this.setState({actualizar: false});
    }
    componentDidMount(){
        //crear marcador
        const piura3857 = [-80.6323, -5.194902];

        this.iconFeature = new Feature({
            geometry: new Point(piura3857),
        });

        const iconStyle = new Style({
            image: new Icon(({
            anchor: [0.5,1],
            src: 'https://www.shareicon.net/data/32x32/2016/08/04/806892_interface_512x512.png'
            }))
        });
        this.iconFeature.setStyle(iconStyle);

        const vectorSource = new VectorSource({
            features: [this.iconFeature]
        });

        const vectorLayer = new VectorLayer({
            source: vectorSource
        });

        this.map = new Map({
            target: 'mapa',
            layers: [
              new TileLayer({
                source: new OSM()
              }),
              vectorLayer
            ],
            view: new View({
              center: piura3857,
              zoom: 17,
              projection: 'EPSG:4326'
            })
        });

        this.map.on('singleclick', (evt)=>{
            const [longitud,latitud] = evt.coordinate;
            this.iconFeature.setGeometry(new Point([longitud, latitud]));
            this.setState({longitud, latitud});
        });

    }

    verUbicacionAlumno(longitud, latitud) {
        console.log(longitud,latitud);
        this.iconFeature.setGeometry(new Point([longitud, latitud]));
        // this.map.getView().setCenter([longitud, latitud]);
        this.map.getView().animate({
            center: [longitud, latitud],
            duration: 2000
        });
    }

    render() {
        return (
            <React.Fragment>
                <div className="container">
                    <div className="row">
                        <Query query={GET_ALUMNOS}>
                            {({ loading, error, data, refetch }) => {
                                if (loading) return <FontAwesomeIcon icon={faSpinner} className="fa-spin"/>;
                                if (error) return <h4>Error: {error.message}</h4>
                                return (
                                    <React.Fragment>
                                        <div className="col-md-4">
                                            <FormularioAlumno refetch={refetch}
                                            onChangePropiedadAlumno={this.onChangePropiedadAlumno} {...this.state}
                                            cambiarAModoIngreso={this.cambiarAModoIngreso}></FormularioAlumno>
                                        </div>
                                        <div className="col-md-8">
                                            <ListaAlumnos alumnos={data.alumnos} refetch={refetch}
                                            cambiarAModoActualizacion={this.cambiarAModoActualizacion}
                                            verUbicacionAlumno={this.verUbicacionAlumno}></ListaAlumnos>
                                        </div>
                                    </React.Fragment>
                                );
                            }}
                        </Query>
                    </div>
                    <div className="row">
                        <div id="mapa" className={estilos.map}>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    };
}

export default Alumno;