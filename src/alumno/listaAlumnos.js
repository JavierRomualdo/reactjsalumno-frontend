import React from "react";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faPencilAlt, faTimes, faSpinner } from '@fortawesome/free-solid-svg-icons'
import {Query} from 'react-apollo';
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

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

const ELIMINAR_ALUMNO = gql`
mutation eliminarAlumno($id:Int!){
    eliminarAlumno(id: $id)
}
`;

function ListaAlumnos(props) {

        return (
            <React.Fragment>
                <h3 className="text-center">Lista de alumnos</h3>
                <Table striped bordered hover size="sm" responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Id</th>
                            <th>Nombre</th>
                            <th>Edad</th>
                            <th>Sexo</th>
                            <th>Accion</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.alumnos.map((alumno, index) => (
                            <tr key={alumno.id}>
                                <td>{index + 1}</td>
                                <td>{alumno.id}</td>
                                <td>{alumno.nombre}</td>
                                <td>{alumno.edad}</td>
                                <td>{alumno.sexo}</td>
                                <td>
                                    <Button variant="success" className="btn btn-sm mr-1" onClick={props.cambiarAModoActualizacion.bind(null, alumno)}>
                                        <FontAwesomeIcon prefix="fas" icon={faPencilAlt}/>
                                    </Button>
                                    <Mutation mutation={ELIMINAR_ALUMNO}>
                                    {(eliminarAlumno, {loading, error}) => {
                                        if (loading) return <FontAwesomeIcon icon={faSpinner}/>;
                                        if (error) return <h4>Error: {error.message}</h4>;
                                        return (
                                            <Button variant="danger" className="btn btn-sm mr-1" onClick={()=>{
                                                eliminarAlumno({
                                                    variables:{
                                                        id: parseInt(alumno.id)
                                                    }
                                                }).then(() => props.refetch());
                                            }}>
                                                <FontAwesomeIcon icon={faTimes}/>
                                            </Button>
                                        );
                                    }}
                                    </Mutation>
                                    <Button variant="success" className="btn btn-sm" onClick={props.verUbicacionAlumno.bind(null, alumno.longitud, alumno.latitud)}>
                                        Ver ubicacion
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </React.Fragment>
        );
}

export default ListaAlumnos;