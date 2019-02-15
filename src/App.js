import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import React from 'react';
import Header from './componentes/header.template';
import Footer from './componentes/footer.template';
import Alumno from './alumno/alumno.template';

function App(props){
    return (
        <React.Fragment>
            <Header></Header>
                <Alumno></Alumno>
            <Footer></Footer>
        </React.Fragment>
    );
}

export default App;