import database from "../db/connection.mjs";

const Departments = async () => {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM Department";

        database.query(query, (error, data) => {
            if (error) {
                reject(error);
                return;
            }

            if (data.length === 0) {
                reject("Departments not found");
                return;
            }

            resolve(data);
        });
    });
};

export default Departments;