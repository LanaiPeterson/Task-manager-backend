    import Project from "../models/Project.js";

    // Middleware to check if user owns the project
    const checkProjectOwnership = async (req, res, next) => {
    const resource = await Project.findById(req.params.id);
    if (!resource) {
        return res.status(404).json({ message: "Project not found" });
    }
    if (resource.owner.toString() !== req.user.id) {
        return res.status(403).json({ message: "You do not have permission to access this project" });
    }
    next();
};

export default checkProjectOwnership;

