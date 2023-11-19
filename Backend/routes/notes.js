const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const fatchuser = require('../middleware/fatchuser');
const { body, validationResult } = require('express-validator');

// route 1 : get all the notes useing GET: - "api/notes/fatchallnotes". login required
router.get('/fatchallnotes', fatchuser, async (req, res) => {
    try {

        const notes = await Note.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("some error occured.");
    };
});
// route 2 :  create a new notes using GET :- "api/notes/addnotes" . login required
router.post('/addnotes', fatchuser, [
    body('title', "enter tha valid title").isLength({ min: 3 }),
    body('discription', "discription must be atleast 5 charactor").isLength({ min: 5 })
], async (req, res) => {

    try {
        const { title, discription, tag } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const note = new Note({
            title, discription, tag, user: req.user.id
        })
        const savednotes = await note.save();
        res.json(savednotes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("some error occureddddd.");
    };
});

// route 3 :  update notes using put :- "api/notes/updatenotes" . login required
router.put('/updatenotes/:id', fatchuser, async (req, res) => {

    const { title, discription, tag } = req.body;

    const newNote = {};

    if (title) { newNote.title = title };
    if (discription) { newNote.discription = discription };
    if (tag) { newNote.tag = tag };

    // find the note which updated and update it

    let note = await Note.findById(req.params.id);

    if (!note) {
        return res.status(404).send("Not Found");
    }

    if (note.user.toString() !== req.user.id) {
        return res.status(401).send("not Allowed")
    }

    note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
    res.json({ note });

});

// route 4 :  delete notes using delete :- "api/notes/deletenotes/:id" . login required
router.delete('/deletenotes/:id', fatchuser, async (req, res) => {

    const { title, discription, tag } = req.body;
    const newNote = {};

    if (title) { newNote.title = title };
    if (discription) { newNote.discription = discription };
    if (tag) { newNote.tag = tag };

    // find the note which updated and update it

    let note = await Note.findById(req.params.id);

    if (!note) {
        return res.status(404).send("Not Found");
    }

    if (note.user.toString() !== req.user.id) {
        return res.status(401).send("not Allowed")
    }

    note = await Note.findByIdAndDelete(req.params.id);
    res.json({ sucess : "your note has been deleted ", note :note  });

});

module.exports = router;