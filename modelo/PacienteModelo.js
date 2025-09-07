const db = require('./bd/Conexion');

class PacienteModelo {
    constructor(documento, nombres, telefono, correo, direccion) {
        this.documento = documento;
        this.nombres = nombres;
        this.telefono = telefono;
        this.correo = correo;
        this.direccion = direccion;
    }

    static async getAll() {
        try {
            const result = await db.query('SELECT * FROM paciente ORDER BY idpaciente');
            return result.rows;
        } catch (error) {
            console.error('Error en getAll:', error);
            throw error;
        }
    }

    static async getByDoc(id) {
    try {
        const result = await db.query(
            'SELECT * FROM paciente WHERE documento LIKE $1',
            [`%${id}%`] 
        );
        return result.rows;
        } catch (error) {
            console.error('Error en getByDoc:', error);
            throw error;
        }
    }

    async save() {
        const query = `
            INSERT INTO paciente (documento, nombres, telefono, correo, direccion)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING idpaciente
        `;
        const values = [this.documento, this.nombres, this.telefono, this.correo, this.direccion];
        try {
            const result = await db.query(query, values);
            this.idpaciente = result.rows[0].idpaciente;
            return this;
        } catch (error) {
            console.error('Error en save:', error);
            throw error;
        }
    }

    static async update(id, datos) {
        const fields = Object.keys(datos);
        const values = Object.values(datos);

        if (fields.length === 0) {
            throw new Error('No hay campos para actualizar');
        }

        const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
        const query = `UPDATE paciente SET ${setClause} WHERE idpaciente = $${fields.length + 1}`;
        values.push(id);

        try {
            await db.query(query, values);
            return { idpaciente: id, ...datos };
        } catch (error) {
            console.error('Error en update:', error);
            throw error;
        }
    }

    static async delete(id) {
        try {
            const result = await db.query('DELETE FROM paciente WHERE idpaciente = $1', [id]);
            return result.rowCount > 0;
        } catch (error) {
            console.error('Error en delete:', error);
            throw error;
        }
    }
    static async update(id, datos) {
            const fields = Object.keys(datos);
            const values = Object.values(datos);
    
            if (fields.length === 0) {
                throw new Error('No hay campos para actualizar');
            }
    
            const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
            const query = `UPDATE paciente SET ${setClause} WHERE idpaciente = $${fields.length + 1}`;
            values.push(id);
    
            try {
                await db.query(query, values);
                return { idpaciente: id, ...datos };
            } catch (error) {
                console.error('Error en update:', error);
                throw error;
            }
        }
        static async delete(id) {
                try {
                    const result = await db.query('DELETE FROM paciente WHERE idpaciente = $1', [id]);
                    return result.rowCount > 0;
                } catch (error) {
                    console.error('Error en delete:', error);
                    throw error;
                };
            };
};

module.exports = PacienteModelo;