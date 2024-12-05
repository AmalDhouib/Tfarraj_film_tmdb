const fs = require("fs");
const path = require("path");

// Chemin du dossier contenant les vidéos
const folderPath = "C:/Users/21697/OneDrive/Bureau/node/movies";

(async () => {
  try {
    // Lister tous les fichiers dans le dossier
    const files = fs.readdirSync(folderPath);

    // Filtrer les fichiers avec l'extension .mp4.part
    const filesToDelete = files.filter((file) =>
      file.toLowerCase().endsWith(".mp4.part")
    );

    // Supprimer les fichiers trouvés
    for (const file of filesToDelete) {
      const filePath = path.join(folderPath, file);
      fs.unlinkSync(filePath);
      console.log(`Fichier supprimé : ${file}`);
    }

    if (filesToDelete.length === 0) {
      console.log("Aucun fichier .mp4.part trouvé.");
    } else {
      console.log(`${filesToDelete.length} fichiers .mp4.part supprimés.`);
    }
  } catch (err) {
    console.error("Erreur lors de la suppression des fichiers :", err);
  }
})();
