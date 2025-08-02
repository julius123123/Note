const mapDBtoModel = ({
    id,
    title,
    body,
    tags,
    create_at,
    update_at
}) => ({
    id,
    title,
    body,
    tags,
    createdAT: create_at,
    updatedAt: update_at, 
});

module.exports = {mapDBtoModel};