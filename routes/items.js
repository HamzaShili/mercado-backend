const express = require('express');

const { itemValidator } = require('../utilities/validators');
const Item = require('../models/Item');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const items = await Item.find()
        res.status(200).json(items)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id)
        if (item) {
            res.status(200).json(item)
        } else {
            res.status(404).json({ error: "Item not found" })
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

router.post('/', async (req, res) => {
    try {
        const validationResult = itemValidator.validate(req.body, { abortEarly: false })
        if (validationResult.error) {
            res.status(400).json(validationResult)
        } else {
            const item = new Item({
                title: req.body.title,
                description: req.body.description,
                photo: req.body.photo,
                price: req.body.price
            })
            await item.save()
            res.status(201).json({message: "Item created successfully"})
        }    
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

router.put('/:id', async (req, res) => {
    try {
        const itemToUpdateId = req.params.id
        const validationResult = itemValidator.validate(req.body, { abortEarly: false })
        if (validationResult.error) {
            res.json(validationResult)
        } else {
            const item = await Item.findByIdAndUpdate(itemToUpdateId, req.body)
            if (!item) {
                res.status(404).json({error: "Item not found"})
            } else {
                res.status(200).json({message: "Item updated successfully"})
            }
        }     
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const itemToDeleteId = req.params.id
        const result = await Item.deleteOne({ _id: itemToDeleteId })
        if (result.deletedCount === 1) {
            res.json({message: "Item deleted successfully"})
        } else {
            res.status(404).json({error: "Item not found"})
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})


module.exports = router;