var express = require('express');
var router = express.Router();

var database = require('../database');

var auth = require('../middleware/auth');

/* GET users listing. */
router.get('/', auth, function(req, res, next) {
  var query = 'SELECT * FROM tasks ORDER BY id DESC';

    database.query(query, function(err, data) {
        if (err) {
            console.log(err);
            return res.status(500).json({message: 'Something went wrong'});
        }
        var result = {
            'status': 200,
            'data': data,
            'message': 'Tasks fetched successfully',
        };

        if(req.new_auth_token) {
            result['new_auth_token'] = req.new_auth_token;
        }

        return res.json(result);
    });

});

router.post('/', auth, function(req, res, next) {
    let title = req.body.title;
    let description = req.body.description;

    var query = `INSERT INTO tasks (title, description) VALUES ('${title}', '${description}')`;

    database.query(query, function(err, data) {
        if (err) {
            console.log(err);
            return res.status(500).json({message: 'Something went wrong'});
        }
        var result = {
            'status': 200,
            'data': data,
            'message': 'Tasks Added successfully',
        };

        if(req.new_auth_token) {
            result['new_auth_token'] = req.new_auth_token;
        }

        return res.json(result);
        // return res.json(data);
    });
});

router.put('/:id', auth, function(req, res, next) {
    let id = req.params.id;
    let title = req.body.title;
    let description = req.body.description;

    var query = `UPDATE tasks SET title = '${title}', description = '${description}' WHERE id = ${id}`;

    database.query(query, function(err, data) {
        if (err){
            console.log(err);
            return res.status(500).json({message: 'Something went wrong'});
        }
        var result = {
            'status': 200,
            'data': data,
            'message': 'Task Updated successfully',
        };

        if(req.new_auth_token) {
            result['new_auth_token'] = req.new_auth_token;
        }

        return res.json(result);
        // return res.json(data);
    });
});

router.delete('/:id', auth, function(req, res, next) {
    let id = req.params.id;

    var query = `DELETE FROM tasks WHERE id = ${ id }`

    database.query(query, function(err, data) {
        if (err) {
            console.log(err);
            return res.status(500).json({message: 'Something went wrong'});
        }
        var result = {
            'status': 200,
            'data': data,
            'message': 'Tasks Deleted successfully',
        };

        if(req.new_auth_token) {
            result['new_auth_token'] = req.new_auth_token;
        }

        return res.json(result);
        // return res.json(data);
    });

});

router.get('/:id', auth, function(req, res, next) {
    let id = req.params.id;

    var query = `SELECT * FROM tasks WHERE id = ${id}`;

    database.query(query, function(err, data) {
        if (err) {
            console.log(err);
            return res.status(500).json({message: 'Something went wrong'});
        }else{
            // const result = {
            //     'status': 200,
            //     'data': data[0],
            //     'message': 'Task fetched successfully',
            // };
            var result = {
                'status': 200,
                'data': data[0],
                'message': 'Tasks Added successfully',
            };
    
            if(req.new_auth_token) {
                result['new_auth_token'] = req.new_auth_token;
            }
    
            return res.json(result);
            // return res.json(result);
        }
    });
});


module.exports = router;
