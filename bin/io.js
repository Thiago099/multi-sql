const fs = require('fs');

module.exports.read_file =  (file) =>
{
    return new Promise((resolve, reject) => 
    {
        fs.readFile(file, 'utf8', (err, data) => 
        {
            if (err) 
            {
                reject(err);
            } 
            else 
            {
                resolve(data);
            }
        });
    });
};
