const mapDBtoModel = ({
    id,
    title,
    body,
    tags,
    create_at,
    update_at,
    username
}) => ({
    id,
    title,
    body,
    tags,
    createdAT: create_at,
    updatedAt: update_at,
    username, 
});

module.exports = {mapDBtoModel};