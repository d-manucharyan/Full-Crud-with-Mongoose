const { schema } = require("../schema")
const fs = require('fs').promises
const path = require('path')

class AuthController {
    async getHome(req, res) {
        try {
            const products = await req.app.locals.services.products.getProducts()
            res.status(200).set({ "Content-Type": "text/html" }).render('home', { products })
        } catch (error) {
            res.status(500).set({ "Content-Type": "application/json" }).json({ message: "Failed to load home page", error: error.message })
        }
    }
    async getUsers(req, res) {
        try {
            const users = await req.app.locals.services.users.getUsers()
            res.status(200).set({ "Content-Type": "text/html" }).render('users', { users })
        } catch (error) {
            res.status(500).set({ "Content-Type": "application/json" }).json({ message: "Failed to fetch users", error: error.message })
        }
    }
    async getUser(req, res) {
        try {
            const user = await req.app.locals.services.users.getUser(req.params.id)
            res.status(200).set({ "Content-Type": "text/html" }).render('user', { user })
        } catch (error) {
            res.status(500).set({ "Content-Type": "application/json" }).json({ message: "Failed to fetch user", error: error.message })
        }
    }
    async getRegister(req, res) {
        try {
            res.status(200).set({ "Content-Type": "text/html" }).render('register')
        } catch (error) {
            res.status(500).set({ "Content-Type": "application/json" }).json({ message: "Failed to load register page", error: error.message })
        }
    }
    async postUser(req, res) {
        try {
            const validated = await schema.validateAsync(req.body)
            if (req.file) {
                await req.app.locals.services.users.postUser({ ...validated, avatarUrl: `/${req.file.filename}` })
            } else {
                await req.app.locals.services.users.postUser({ ...validated, avatarUrl: '/default.png' })
            }
            console.log(req.file);

            res.status(201).set({ "Content-Type": "text/html" }).redirect('/')
        } catch (error) {
            if (error.isJoi) {
                return res.status(400).set({ "Content-Type": "application/json" }).json({ message: "Validation failed", error: error.message })
            }
            res.status(500).set({ "Content-Type": "application/json" }).json({ message: "Failed to create user", error: error.message })
        }
    }
    async addPhoto(req, res) {
        const user = await req.app.locals.services.users.getUser(req.params.id)

        if (user.avatarUrl && user.avatarUrl !== '/default.png') {
            const oldPhoto = path.join(__dirname, '..', 'uploads', path.basename(user.avatarUrl))
            try {
                await fs.unlink(oldPhoto)
            } catch (error) {
                console.log(error)
            }
        }
        user.avatarUrl = "/" + req.file.filename
        await user.save()
        res.redirect("/user/" + user._id)
    }
    async getLogin(req, res) {
        try {
            res.status(200).set({ "Content-Type": "text/html" }).render('login')
        } catch (error) {
            res.status(500).set({ "Content-Type": "application/json" }).json({ message: "Failed to load login page", error: error.message })
        }
    }

    async postLogin(req, res) {
        try {
            const result = await req.app.locals.services.users.postLogin(req.body)
            if (!result.success) {
                return res.status(401).render('loginerror')
            }
            res.redirect(`/logged/${result.id}`)
        } catch (error) {
            res.status(500).json({ message: "Something went wrong" })
        }
    }

    async getLogged(req, res) {
        try {
            const user = await req.app.locals.services.users.getUser(req.params.id)
            const products = await req.app.locals.services.products.getProducts()
            res.status(200).render('logged', { user, products })
        } catch (error) {
            res.status(500).json({ message: "Failed to load logged page", error: error.message })
        }
    }

    async deleteUser(req, res) {
        try {
            const user = await req.app.locals.services.users.getUser(req.params.id)
            if (user.avatarUrl && user.avatarUrl !== '/default.png') {
                const photoPath = path.join(__dirname, '..', 'uploads', path.basename(user.avatarUrl));
                try {
                    await fs.unlink(photoPath);
                } catch (error) {
                    console.error(error);
                }
            }
            await req.app.locals.services.users.deleteUser(req.params.id)
            res.status(200).set({ 'Content-Type': 'application/json' }).json({ message: "User deleted" })
        } catch (error) {
            res.status(500).json({ message: "Delete failed" });
        }
    }
    async editUser(req, res) {
        await req.app.locals.services.users.editUser(req.params.id, req.body)
        res.status(200).set({ 'Content-Type': 'application/json' }).json({ message: "User updated" })
    }
}


module.exports = { AuthController }