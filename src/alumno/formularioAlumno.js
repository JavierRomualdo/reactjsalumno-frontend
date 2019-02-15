import React from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const INGRESAR_ALUMNO = gql`
mutation ingresarAlumno($nombre:String!,$edad:Int!,$sexo:String!,
    $longitud: Float!, $latitud: Float!){
    ingresarAlumno(nombre: $nombre,
      edad: $edad, sexo: $sexo, longitud: $longitud, latitud: $latitud){
      id
      nombre
      edad
      sexo
      longitud
      latitud
    }
}
`;

const ACTUALIZAR_ALUMNO = gql`
mutation actualizarAlumno($id:ID!,
    $nombre: String!, $edad: Int!,
    $sexo: String!, $longitud: Float!, $latitud: Float!){
    actualizarAlumno(id: $id, nombre: $nombre,
        edad: $edad, sexo: $sexo, longitud: $longitud, latitud: $latitud) {
        id
        nombre
        edad
        sexo
        longitud
        latitud
      }
}
`;

function FormularioAlumno(props) {
        const {id, nombre, edad, sexo, longitud, latitud, onChangePropiedadAlumno, actualizar} = props;
        return (
            <React.Fragment>
                <Form className="container">
                    <h3>Formulario</h3>
                    <Form.Group controlId="formNombre">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control name='nombre' type="text" value={nombre} onChange={onChangePropiedadAlumno}
                            placeholder="Ingrese nombre" required></Form.Control>
                    </Form.Group>
                    <Form.Group controlId="formEdad">
                        <Form.Label>Edad</Form.Label>
                        <Form.Control name="edad" type="text" value={edad} onChange={onChangePropiedadAlumno}
                            placeholder="Ingrese edad" required></Form.Control>
                    </Form.Group>
                    <Form.Group controlId="formSexo">
                        <Form.Label>Sexo</Form.Label>
                        <Form.Control as="select" name="sexo"  value={sexo} required onChange={onChangePropiedadAlumno}>
                            <option value=''>Seleccione...</option>
                            <option value='M'>M</option>
                            <option value='F'>F</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="formLongitud">
                        <Form.Label>Longitud</Form.Label>
                        <Form.Control name='longitud' type="text" disabled value={longitud} onChange={onChangePropiedadAlumno}
                            placeholder="Ingrese longitud" required></Form.Control>
                    </Form.Group>
                    <Form.Group controlId="formLatitud">
                        <Form.Label>Longitud</Form.Label>
                        <Form.Control name='latitud' type="text" disabled value={latitud} onChange={onChangePropiedadAlumno}
                            placeholder="Ingrese latitud" required></Form.Control>
                    </Form.Group>
                    {!actualizar &&
                        <Mutation mutation={INGRESAR_ALUMNO}>
                            {(ingresarAlumno,{loading, error}) => {
                                if (loading) return <FontAwesomeIcon icon={faSpinner} className="fa-spin"/>;
                                if (error) return <h4>Error: {error.message}</h4>
                                return (
                                    <Button variant="primary" onClick={()=>{
                                        ingresarAlumno({
                                            variables:{
                                                nombre,
                                                edad: parseInt(edad),
                                                sexo,
                                                longitud,
                                                latitud
                                            }
                                        }).then(() => {props.refetch()});
                                    }}>
                                        Guardar
                                    </Button>
                                );
                            }}
                        </Mutation>
                    }

                    {actualizar &&
                        <Mutation mutation={ACTUALIZAR_ALUMNO}>
                        {(actualizarAlumno,{loading, error}) =>{
                            if (loading) return <FontAwesomeIcon icon={faSpinner} className="fa-spin"/>;
                            if (error) return <h4>Error: {error.message}</h4>
                            return (
                                <Button variant="primary" onClick={()=>{
                                    actualizarAlumno({
                                        variables:{
                                            id,
                                            nombre,
                                            edad: parseInt(edad),
                                            sexo,
                                            longitud,
                                            latitud
                                        }
                                    }).then(() => {
                                        props.cambiarAModoIngreso();
                                        props.refetch();
                                    });
                                }}>
                                    Actualizar
                                </Button>
                            );
                        }}
                        </Mutation>
                    }
                </Form>
            </React.Fragment>
        )
}

export default FormularioAlumno;