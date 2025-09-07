// controllers/PacienteControlador.js
const Paciente = require('../modelo/PacienteModelo');

const PacienteControlador = {
    // GET /pacientes
    async vistaTodo(req, res) {
        try {
            const pacientes = await Paciente.getAll();
            res.status(200).json(pacientes);
        } catch (error) {
            console.error('Error al mostrar pacientes:', error);
            res.status(500).json({ mensaje: 'Error al obtener los pacientes' });
        }
    },

    // GET /pacientes/:id
    async vistaDoc(req, res) {
        const { t1: id } = req.params;
        try {
            const paciente = await Paciente.getByDoc(id);
            res.status(200).json(paciente);
        } catch (error) {
            console.error('Error al obtener paciente por ID:', error);
            res.status(500).json({ mensaje: 'Error al obtener el paciente' });
        }
    },

     async crearPaciente(req, res) {
        const { t1: documento, t2: nombres, t3: telefono, t4: correo, t5: direccion } = req.body;
        if (!documento || !nombres || !telefono || !correo || !direccion) {
            return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
        }

        try {
            const nuevoPaciente = new Paciente(documento, nombres, telefono, correo, direccion);
            const pacienteGuardado = await nuevoPaciente.save();
            res.status(201).json(pacienteGuardado);
        } catch (error) {
            console.error('Error al crear paciente:', error);
            res.status(500).json({ mensaje: 'Error al crear el paciente' });
        }
    },

    async actualizar(req, res) {
    const { id } = req.params;
    const { t1, t2, t3, t4, t5 } = req.body; // Desestructuras los datos

    // Crea un objeto con las claves correctas para el modelo
    const datos = {};
    if (t1) datos.documento = t1;
    if (t2) datos.nombres = t2;
    if (t3) datos.telefono = t3;
    if (t4) datos.correo = t4;
    if (t5) datos.direccion = t5;

    if (Object.keys(datos).length === 0) {
        return res.status(400).json({ mensaje: 'No hay datos para actualizar' });
    }

    try {
        const pacienteExistente = await Paciente.getByDoc(id);
        if (!pacienteExistente) {
            return res.status(404).json({ mensaje: 'Paciente no encontrado' });
        }

        const pacienteActualizado = await Paciente.update(id, datos);
        res.status(200).json(pacienteActualizado);
    } catch (error) {
        console.error('Error al actualizar paciente:', error);
        res.status(500).json({ mensaje: 'Error al actualizar el paciente' });
    }
},
 async eliminar(req, res) {
        const { id } = req.params;
        try {
            const eliminado = await Paciente.delete(id);
            if (!eliminado) {
                return res.status(404).json({ mensaje: 'Paciente no encontrado' });
            }
            res.status(200).json({ mensaje: 'Paciente eliminado correctamente' });
        } catch (error) {
            console.error('Error al eliminar paciente:', error);
            res.status(500).json({ mensaje: 'Error al eliminar el paciente' });
        };
    }
};

module.exports = PacienteControlador;