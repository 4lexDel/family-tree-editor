import FamilyTree from "../familyTree/components/FamilyTree/FamilyTree";

const FamilyPage = () => {
  const data = {
    individuals: [
      { id: 1, gender: 1, name: "Amaury DELORME" },
      { id: 2, gender: 2, name: "Delphine DELORME" },
      { id: 3, gender: 1, name: "Martin DELORME" },
      { id: 4, gender: 1, name: "Alexandre DELORME" },
      { id: 5, gender: 1, name: "Thomas DELORME" },
      { id: 6, gender: 1, name: "Bertrand DEHELLY" },
      { id: 7, gender: 2, name: "Martine DEHELLY" },
      { id: 8, gender: 1, name: "Hubert DELORME" },
      { id: 9, gender: 2, name: "Solange DELORME" },
      { id: 10, gender: 1, name: "Thibault DELORME" },
      { id: 11, gender: 1, name: "Arnaud DELORME" },
      { id: 12, gender: 1, name: "Adrien DEHELLY" },
      { id: 13, gender: 1, name: "Nicolas DEHELLY" },
      { id: 14, gender: 1, name: "Thibault DEHELLY" },
      { id: 15, gender: 2, name: "Laure-Anne DEHELLY" },
      { id: 16, gender: 1, name: "Roxanne DEHELLY" },
      { id: 17, gender: 2, name: "Lucille DELORME" },
      { id: 18, gender: 1, name: "Sacha DELORME" },
      { id: 19, gender: 2, name: "Noemie DELORME" },
      { id: 20, gender: 1, name: "Damien ASTOLFI" },
      { id: 21, gender: 2, name: "Marie MANSON" },
      { id: 22, gender: 1, name: "Jacques Dehelly" },
      { id: 23, gender: 2, name: "Alix Ducasse" },
      { id: 24, gender: 1, name: "Philippe PAROISSIEN" },
      { id: 25, gender: 2, name: "Jacqueline MARTIN" },
      { id: 26, gender: 1, name: "Jean DELORME" },
      { id: 27, gender: 2, name: "Marie Jeanne Antoinette AMARDEILH" },
      { id: 28, gender: 1, name: "Maurice MERCKELBAGH" },
      { id: 29, gender: 2, name: "Suzanne LE GO" },
    ],

    families: [
      {
        husband: 1,
        wife: 2,
        children: [3, 4, 5]
      },
      {
        husband: 6,
        wife: 7,
        children: [2, 12, 13, 14]
      },
      {
        husband: 8,
        wife: 9,
        children: [1, 10, 11]
      },
      {
        husband: 12,
        wife: 15,
        children: [16]
      },
      {
        husband: 4,
        wife: 17,
        children: [18, 19]
      },
      {
        husband: 20,
        wife: 21,
        children: [17]
      },
      // {
      //   husband: 22,
      //   wife: 23,
      //   children: [6]
      // },
      {
        husband: 24,
        wife: 25,
        children: [7]
      },
      {
        husband: 26,
        wife: 27,
        children: [8]
      },
      // {
      //   husband: 28,
      //   wife: 29,
      //   children: [9]
      // }
    ]
  }

  return (
    <div className='family-page page'>
      <FamilyTree data={data}></FamilyTree>
    </div>
  );
}

export default FamilyPage;
