export interface Option {
  key: string; // a, b, c
  spanish: string;
  armenian: string;
}

export interface Question {
  id: string;
  category: string;
  spanish: string;
  armenian: string;
  options: Option[];
}

export interface Ticket {
  id: string;
  title: string;
  titleArmenian: string;
  questions: Question[];
}

export const QUESTIONS_DATA: Question[] = [
  // Block 1 (Colores / General)
  {
    id: "col_title",
    category: "Colores",
    spanish: "¿Qué colores conoces?",
    armenian: "Ի՞նչ գույներ գիտես։",
    options: [
      { key: "a", spanish: "Conozco rojo, azul y verde.", armenian: "Ես գիտեմ կարմիր, կապույտ և կանաչ։" },
      { key: "b", spanish: "Conozco blanco, negro y amarillo.", armenian: "Ես գիտեմ սպիտակ, սև և դեղին։" },
      { key: "c", spanish: "Conozco rosa, gris y naranja.", armenian: "Ես գիտեմ վարդագույն, մոխրագույն և նարնջագույն։" }
    ]
  },
  {
    id: "col_1",
    category: "Colores",
    spanish: "1. ¿De qué color es tu camiseta?",
    armenian: "Քո շապիկն ի՞նչ գույնի է։",
    options: [
      { key: "a", spanish: "Mi camiseta es blanca.", armenian: "Իմ շապիկը սպիտակ է։" },
      { key: "b", spanish: "Mi camiseta es azul.", armenian: "Իմ շապիկը կապույտ է։" },
      { key: "c", spanish: "Mi camiseta es negra.", armenian: "Իմ շապիկը սև է։" }
    ]
  },
  {
    id: "col_2",
    category: "Colores",
    spanish: "2. ¿Qué color te gusta más: rojo, azul o verde?",
    armenian: "Ո՞ր գույնն ես ավելի շատ սիրում՝ կարմի՞ր, կապո՞ւյտ, թե՞ կանաչ։",
    options: [
      { key: "a", spanish: "Me gusta más el rojo.", armenian: "Ես ավելի շատ սիրում եմ կարմիրը։" },
      { key: "b", spanish: "Me gusta más el azul.", armenian: "Ես ավելի շատ սիրում եմ կապույտը։" },
      { key: "c", spanish: "Me gusta más el verde.", armenian: "Ես ավելի շատ սիրում եմ կանաչը։" }
    ]
  },
  {
    id: "col_3",
    category: "Colores",
    spanish: "3. ¿Qué llevas normalmente en la maleta?",
    armenian: "Սովորաբար ի՞նչ ես դնում ճամպրուկի մեջ։",
    options: [
      { key: "a", spanish: "Llevo ropa y zapatos.", armenian: "Ես վերցնում եմ հագուստ և կոշիկներ։" },
      { key: "b", spanish: "Llevo una camiseta y una chaqueta.", armenian: "Ես վերցնում եմ շապիկ և բաճկոն։" },
      { key: "c", spanish: "Llevo mi teléfono y documentación.", armenian: "Ես վերցնում եմ հեռախոսս և փաստաթղթերս։" }
    ]
  },
  {
    id: "col_4",
    category: "Colores",
    spanish: "4. ¿Qué compras en el supermercado?",
    armenian: "Ի՞նչ ես գնում սուպերմարկետում։",
    options: [
      { key: "a", spanish: "Compro pan, leche y queso.", armenian: "Ես գնում եմ հաց, կաթ և պանիր։" },
      { key: "b", spanish: "Compro tomate, zanahoria y fruta.", armenian: "Ես գնում եմ լոլիկ, գազար և միրգ։" },
      { key: "c", spanish: "Compro agua, zumo y galletas.", armenian: "Ես գնում եմ ջուր, հյութ և թխվածքաբլիթներ։" }
    ]
  },
  {
    id: "col_5",
    category: "Colores",
    spanish: "5. ¿Qué bebida prefieres: agua, café o zumo?",
    armenian: "Ո՞ր ըմպելիքն ես նախընտրում՝ ջո՞ւր, սո՞ւրճ, թե՞ հյութ։",
    options: [
      { key: "a", spanish: "Prefiero agua.", armenian: "Ես նախընտրում եմ ջուր։" },
      { key: "b", spanish: "Prefiero café.", armenian: "Ես նախընտրում եմ սուրճ։" },
      { key: "c", spanish: "Prefiero zumo.", armenian: "Ես նախընտրում եմ հյութ։" }
    ]
  },
  {
    id: "col_6",
    category: "Colores",
    spanish: "6. ¿Qué comes de postre?",
    armenian: "Ի՞նչ ես ուտում որպես աղանդեր։",
    options: [
      { key: "a", spanish: "Como helado.", armenian: "Ես ուտում եմ պաղպաղակ։" },
      { key: "b", spanish: "Como fruta.", armenian: "Ես ուտում եմ միրգ։" },
      { key: "c", spanish: "Como tarta.", armenian: "Ես ուտում եմ տորթ։" }
    ]
  },
  {
    id: "col_7",
    category: "Colores",
    spanish: "7. ¿Qué plato sabes cocinar?",
    armenian: "Ո՞ր ուտեստը գիտես պատրաստել։",
    options: [
      { key: "a", spanish: "Sé cocinar sopa.", armenian: "Ես գիտեմ ապուր պատրաստել։" },
      { key: "b", spanish: "Sé cocinar arroz.", armenian: "Ես գիտեմ բրինձ պատրաստել։" },
      { key: "c", spanish: "Sé cocinar carne con verduras.", armenian: "Ես գիտեմ միս պատրաստել բանջարեղենով։" }
    ]
  },
  {
    id: "col_8",
    category: "Colores",
    spanish: "8. ¿Vas al colegio a pie o en autobús?",
    armenian: "Դպրոց գնում ես ոտքո՞վ, թե՞ ավտոբուսով։",
    options: [
      { key: "a", spanish: "Voy al colegio a pie.", armenian: "Ես դպրոց գնում եմ ոտքով։" },
      { key: "b", spanish: "Voy al colegio en autobús.", armenian: "Ես դպրոց գնում եմ ավտոբուսով։" },
      { key: "c", spanish: "A veces voy a pie y a veces en autobús.", armenian: "Երբեմն գնում եմ ոտքով, երբեմն՝ ավտոբուսով։" }
    ]
  },
  {
    id: "col_9",
    category: "Colores",
    spanish: "9. ¿Qué transporte usas más: taxi, metro, tren o autobús?",
    armenian: "Ո՞ր տրանսպորտն ես ավելի շատ օգտագործում՝ տաքսի՞, մետրո՞, գնա՞ցք, թե՞ ավտոբուս։",
    options: [
      { key: "a", spanish: "Uso más el autobús.", armenian: "Ես ավելի շատ օգտագործում եմ ավտոբուսը։" },
      { key: "b", spanish: "Uso más el metro.", armenian: "Ես ավելի շատ օգտագործում եմ մետրոն։" },
      { key: "c", spanish: "Uso más el taxi.", armenian: "Ես ավելի շատ օգտագործում եմ տաքսին։" }
    ]
  },

  // Block 2 (Partes del Cuerpo)
  {
    id: "cuerpo_title",
    category: "Cuerpo",
    spanish: "¿Qué partes del cuerpo conoces?",
    armenian: "Մարմնի ի՞նչ մասեր գիտես։",
    options: [
      { key: "a", spanish: "Conozco cabeza, boca y brazo.", armenian: "Ես գիտեմ գլուխ, բերան և ձեռք։" },
      { key: "b", spanish: "Conozco pierna, pie y cuerpo.", armenian: "Ես գիտեմ ոտք, ոտնաթաթ և մարմին։" },
      { key: "c", spanish: "Conozco cabeza, brazo, pierna y pie.", armenian: "Ես գիտեմ գլուխ, ձեռք, ոտք և ոտնաթաթ։" }
    ]
  },
  {
    id: "cuerpo_1",
    category: "Cuerpo",
    spanish: "1. ¿Qué hay al lado de tu casa?",
    armenian: "Քո տան կողքին ի՞նչ կա։",
    options: [
      { key: "a", spanish: "Al lado de mi casa hay una escuela.", armenian: "Իմ տան կողքին դպրոց կա։" },
      { key: "b", spanish: "Al lado de mi casa hay un supermercado.", armenian: "Իմ տան կողքին սուպերմարկետ կա։" },
      { key: "c", spanish: "Al lado de mi casa hay un jardín.", armenian: "Իմ տան կողքին այգի կա։" }
    ]
  },
  {
    id: "cuerpo_2",
    category: "Cuerpo",
    spanish: "2. ¿Tu habitación es grande o pequeña?",
    armenian: "Քո սենյակը մե՞ծ է, թե՞ փոքր։",
    options: [
      { key: "a", spanish: "Mi habitación es grande.", armenian: "Իմ սենյակը մեծ է։" },
      { key: "b", spanish: "Mi habitación es pequeña.", armenian: "Իմ սենյակը փոքր է։" },
      { key: "c", spanish: "Mi habitación no es grande, pero es cómoda.", armenian: "Իմ սենյակը մեծ չէ, բայց հարմարավետ է։" }
    ]
  },
  {
    id: "cuerpo_3",
    category: "Cuerpo",
    spanish: "3. ¿Qué tienes encima de la mesa?",
    armenian: "Սեղանի վրա ի՞նչ ունես։",
    options: [
      { key: "a", spanish: "Tengo un libro encima de la mesa.", armenian: "Սեղանի վրա գիրք ունեմ։" },
      { key: "b", spanish: "Tengo mi teléfono encima de la mesa.", armenian: "Սեղանի վրա իմ հեռախոսն ունեմ։" },
      { key: "c", spanish: "Tengo un vaso y una botella encima de la mesa.", armenian: "Սեղանի վրա բաժակ և շիշ ունեմ։" }
    ]
  },
  {
    id: "cuerpo_4",
    category: "Cuerpo",
    spanish: "4. ¿Qué haces cuando hace buen tiempo?",
    armenian: "Ի՞նչ ես անում, երբ լավ եղանակ է։",
    options: [
      { key: "a", spanish: "Doy un paseo.", armenian: "Ես զբոսնում եմ։" },
      { key: "b", spanish: "Voy al parque.", armenian: "Ես գնում եմ այգի։" },
      { key: "c", spanish: "Juego al fútbol.", armenian: "Ես ֆուտբոլ եմ խաղում։" }
    ]
  },
  {
    id: "cuerpo_5",
    category: "Cuerpo",
    spanish: "5. ¿Qué haces cuando llueve?",
    armenian: "Ի՞նչ ես անում, երբ անձրև է գալիս։",
    options: [
      { key: "a", spanish: "Me quedo en casa.", armenian: "Ես մնում եմ տանը։" },
      { key: "b", spanish: "Leo un libro.", armenian: "Ես գիրք եմ կարդում։" },
      { key: "c", spanish: "Veo la tele.", armenian: "Ես հեռուստացույց եմ դիտում։" }
    ]
  },
  {
    id: "cuerpo_6",
    category: "Cuerpo",
    spanish: "6. ¿A qué hora te levantas normalmente?",
    armenian: "Սովորաբար ժամը քանիսի՞ն ես վեր կենում։",
    options: [
      { key: "a", spanish: "Me levanto a las siete.", armenian: "Ես վեր եմ կենում ժամը յոթին։" },
      { key: "b", spanish: "Me levanto a las ocho.", armenian: "Ես վեր եմ կենում ժամը ութին։" },
      { key: "c", spanish: "Me levanto temprano.", armenian: "Ես շուտ եմ վեր կենում։" }
    ]
  },
  {
    id: "cuerpo_7",
    category: "Cuerpo",
    spanish: "7. ¿Qué haces los viernes por la tarde?",
    armenian: "Ուրբաթ կեսօրից հետո ի՞նչ ես անում։",
    options: [
      { key: "a", spanish: "Voy al cine.", armenian: "Ես գնում եմ կինոթատրոն։" },
      { key: "b", spanish: "Salgo con mis amigos.", armenian: "Ես դուրս եմ գալիս ընկերներիս հետ։" },
      { key: "c", spanish: "Descanso en casa.", armenian: "Ես հանգստանում եմ տանը։" }
    ]
  },
  {
    id: "cuerpo_8",
    category: "Cuerpo",
    spanish: "8. ¿Con quién vas al cine?",
    armenian: "Ո՞ւմ հետ ես գնում կինոթատրոն։",
    options: [
      { key: "a", spanish: "Voy al cine con mi amigo.", armenian: "Ես կինոթատրոն եմ գնում ընկերոջս հետ։" },
      { key: "b", spanish: "Voy al cine con mi familia.", armenian: "Ես կինոթատրոն եմ գնում ընտանիքիս հետ։" },
      { key: "c", spanish: "Voy al cine con mi hermano.", armenian: "Ես կինոթատրոն եմ գնում եղբորս հետ։" }
    ]
  },
  {
    id: "cuerpo_9",
    category: "Cuerpo",
    spanish: "9. ¿Qué quieres hacer durante las vacaciones?",
    armenian: "Ի՞նչ ես ուզում անել արձակուրդների ընթացքում։",
    options: [
      { key: "a", spanish: "Quiero viajar.", armenian: "Ես ուզում եմ ճանապարհորդել։" },
      { key: "b", spanish: "Quiero descansar.", armenian: "Ես ուզում եմ հանգստանալ։" },
      { key: "c", spanish: "Quiero ir a la playa.", armenian: "Ես ուզում եմ գնալ լողափ։" }
    ]
  },
  {
    id: "cuerpo_10",
    category: "Cuerpo",
    spanish: "10. ¿Qué haces los sábados?",
    armenian: "Ի՞նչ ես անում շաբաթ օրերին։",
    options: [
      { key: "a", spanish: "Los sábados descanso en casa.", armenian: "Շաբաթ օրերին ես հանգստանում եմ տանը։" },
      { key: "b", spanish: "Los sábados salgo con mis amigos.", armenian: "Շաբաթ օրերին ես դուրս եմ գալիս ընկերներիս հետ։" },
      { key: "c", spanish: "Los sábados voy de compras.", armenian: "Շաբաթ օրերին ես գնում եմ գնումների։" }
    ]
  },
  {
    id: "cuerpo_11",
    category: "Cuerpo",
    spanish: "11. ¿Qué haces por la mañana?",
    armenian: "Ի՞նչ ես անում առավոտյան։",
    options: [
      { key: "a", spanish: "Por la mañana desayuno.", armenian: "Առավոտյան ես նախաճաշում եմ։" },
      { key: "b", spanish: "Por la mañana voy a clase.", armenian: "Առավոտյան ես գնում եմ դասի։" },
      { key: "c", spanish: "Por la mañana estudio español.", armenian: "Առավոտյան ես իսպաներեն եմ սովորում։" }
    ]
  },
  {
    id: "cuerpo_12",
    category: "Cuerpo",
    spanish: "12. ¿Qué haces por la noche?",
    armenian: "Ի՞նչ ես անում երեկոյան / գիշերը։",
    options: [
      { key: "a", spanish: "Por la noche veo la tele.", armenian: "Երեկոյան ես հեռուստացույց եմ դիտում։" },
      { key: "b", spanish: "Por la noche leo un libro.", armenian: "Երեկոյան ես գիրք եմ կարդում։" },
      { key: "c", spanish: "Por la noche me acuesto temprano.", armenian: "Երեկոյան ես շուտ եմ պառկում քնելու։" }
    ]
  },
  {
    id: "cuerpo_13",
    category: "Cuerpo",
    spanish: "13. ¿Qué comida te gusta más?",
    armenian: "Ո՞ր ուտելիքն ես ավելի շատ սիրում։",
    options: [
      { key: "a", spanish: "Me gusta más la sopa.", armenian: "Ես ավելի շատ ապուր եմ սիրում։" },
      { key: "b", spanish: "Me gusta más el arroz.", armenian: "Ես ավելի շատ բրինձ եմ սիրում։" },
      { key: "c", spanish: "Me gusta más la carne con verduras.", armenian: "Ես ավելի շատ սիրում եմ միս բանջարեղենով։" }
    ]
  },
  {
    id: "cuerpo_14",
    category: "Cuerpo",
    spanish: "14. ¿Qué fruta te gusta?",
    armenian: "Ո՞ր միրգն ես սիրում։",
    options: [
      { key: "a", spanish: "Me gusta el plátano.", armenian: "Ես բանան եմ սիրում։" },
      { key: "b", spanish: "Me gusta la naranja.", armenian: "Ես նարինջ եմ սիրում։" },
      { key: "c", spanish: "Me gusta el melocotón.", armenian: "Ես դեղձ եմ սիրում։" }
    ]
  },
  {
    id: "cuerpo_15",
    category: "Cuerpo",
    spanish: "15. ¿Qué haces en tu tiempo libre?",
    armenian: "Ի՞նչ ես անում ազատ ժամանակ։",
    options: [
      { key: "a", spanish: "En mi tiempo libre juego.", armenian: "Ազատ ժամանակ ես խաղում եմ։" },
      { key: "b", spanish: "En mi tiempo libre escucho música.", armenian: "Ազատ ժամանակ ես երաժշտություն եմ լսում։" },
      { key: "c", spanish: "En mi tiempo libre paseo.", armenian: "Ազատ ժամանակ ես զբոսնում եմ։" }
    ]
  },
  {
    id: "cuerpo_16",
    category: "Cuerpo",
    spanish: "16. ¿Qué deporte practicas?",
    armenian: "Ի՞նչ սպորտով ես զբաղվում։",
    options: [
      { key: "a", spanish: "Practico fútbol.", armenian: "Ես զբաղվում եմ ֆուտբոլով։" },
      { key: "b", spanish: "Practico tenis.", armenian: "Ես զբաղվում եմ թենիսով։" },
      { key: "c", spanish: "Practico boxeo.", armenian: "Ես զբաղվում եմ բռնցքամարտով։" }
    ]
  },
  {
    id: "cuerpo_17",
    category: "Cuerpo",
    spanish: "17. ¿Qué tienes en tu habitación?",
    armenian: "Ի՞նչ ունես քո սենյակում։",
    options: [
      { key: "a", spanish: "Tengo una cama y una mesa.", armenian: "Ես ունեմ մահճակալ և սեղան։" },
      { key: "b", spanish: "Tengo un armario y una silla.", armenian: "Ես ունեմ պահարան և աթոռ։" },
      { key: "c", spanish: "Tengo una lámpara y un ordenador.", armenian: "Ես ունեմ լամպ և համակարգիչ։" }
    ]
  },
  {
    id: "cuerpo_18",
    category: "Cuerpo",
    spanish: "18. ¿Qué haces cuando estás cansado?",
    armenian: "Ի՞նչ ես անում, երբ հոգնած ես։",
    options: [
      { key: "a", spanish: "Descanso.", armenian: "Ես հանգստանում եմ։" },
      { key: "b", spanish: "Me quedo en casa.", armenian: "Ես մնում եմ տանը։" },
      { key: "c", spanish: "Duermo un poco.", armenian: "Ես մի քիչ քնում եմ։" }
    ]
  },
  {
    id: "cuerpo_19",
    category: "Cuerpo",
    spanish: "19. ¿Qué haces antes de salir de casa?",
    armenian: "Ի՞նչ ես անում տնից դուրս գալուց առաջ։",
    options: [
      { key: "a", spanish: "Preparo mi mochila.", armenian: "Ես պատրաստում եմ իմ պայուսակը։" },
      { key: "b", spanish: "Me visto.", armenian: "Ես հագնվում եմ։" },
      { key: "c", spanish: "Cojo mi teléfono.", armenian: "Ես վերցնում եմ իմ հեռախոսը։" }
    ]
  },
  {
    id: "cuerpo_20",
    category: "Cuerpo",
    spanish: "20. ¿Qué haces si no entiendes algo?",
    armenian: "Ի՞նչ ես անում, եթե ինչ-որ բան չես հասկանում։",
    options: [
      { key: "a", spanish: "Hago una pregunta.", armenian: "Ես հարց եմ տալիս։" },
      { key: "b", spanish: "Pregunto al profesor.", armenian: "Ես հարցնում եմ ուսուցչին։" },
      { key: "c", spanish: "Intento entender otra vez.", armenian: "Ես փորձում եմ նորից հասկանալ։" }
    ]
  }
];

// Group questions into tickets of 4-5 questions each for the "random ticket selection / pull ticket" mechanic.
export const TICKETS: Ticket[] = [
  {
    id: "ticket_1",
    title: "Billete de Colores, Ropa y Comida",
    titleArmenian: "Տոմս 1՝ Գույներ, Հագուստ և Սնունդ",
    questions: [
      QUESTIONS_DATA[0], // ¿Qué colores conoces?
      QUESTIONS_DATA[1], // ¿De qué color es tu camiseta?
      QUESTIONS_DATA[2], // ¿Qué color te gusta más?
      QUESTIONS_DATA[3], // ¿Qué llevas en la maleta?
      QUESTIONS_DATA[4]  // ¿Qué compras en el supermercado?
    ]
  },
  {
    id: "ticket_2",
    title: "Billete de Bebidas, Postres y Transportes",
    titleArmenian: "Տոմս 2՝ Ըմպելիքներ, Աղանդեր և Տրանսպորտ",
    questions: [
      QUESTIONS_DATA[5], // ¿Qué bebida prefieres?
      QUESTIONS_DATA[6], // ¿Qué comes de postre?
      QUESTIONS_DATA[7], // ¿Qué plato sabes cocinar?
      QUESTIONS_DATA[8], // ¿Vas al colegio a pie o en autobús?
      QUESTIONS_DATA[9]  // ¿Qué transporte usas más?
    ]
  },
  {
    id: "ticket_3",
    title: "Billete del Cuerpo, Habitación y Tiempo",
    titleArmenian: "Տոմս 3՝ Մարմին, Սենյակ և Եղանակ",
    questions: [
      QUESTIONS_DATA[10], // ¿Qué partes del cuerpo conoces?
      QUESTIONS_DATA[11], // ¿Qué hay al lado de tu casa?
      QUESTIONS_DATA[12], // ¿Tu habitación es grande o pequeña?
      QUESTIONS_DATA[13], // ¿Qué tienes encima de la mesa?
      QUESTIONS_DATA[14]  // ¿Qué haces cuando hace buen tiempo?
    ]
  },
  {
    id: "ticket_4",
    title: "Billete de Rutina Diaria y Horas",
    titleArmenian: "Տոմս 4՝ Օրվա ռեժիմ և Ժամեր",
    questions: [
      QUESTIONS_DATA[15], // ¿Qué haces cuando llueve?
      QUESTIONS_DATA[16], // ¿A qué hora te levantas?
      QUESTIONS_DATA[17], // ¿Qué haces los viernes?
      QUESTIONS_DATA[18], // ¿Con quién vas al cine?
      QUESTIONS_DATA[19]  // ¿Qué quieres hacer durante las vacaciones?
    ]
  },
  {
    id: "ticket_5",
    title: "Billete de Fin de Semana, Comida y Frutas",
    titleArmenian: "Տոմս 5՝ Շաբաթվա ավարտ, Ուտելիք և Մրգեր",
    questions: [
      QUESTIONS_DATA[20], // ¿Qué haces los sábados?
      QUESTIONS_DATA[21], // ¿Qué haces por la mañana?
      QUESTIONS_DATA[22], // ¿Qué haces por la noche?
      QUESTIONS_DATA[23], // ¿Qué comida te gusta más?
      QUESTIONS_DATA[24]  // ¿Qué fruta te gusta?
    ]
  },
  {
    id: "ticket_6",
    title: "Billete de Tiempo Libre, Deportes y Problemas",
    titleArmenian: "Տոմս 6՝ Ազատ ժամանակ, Սպորտ և Խնդիրներ",
    questions: [
      QUESTIONS_DATA[25], // ¿Qué haces en tu tiempo libre?
      QUESTIONS_DATA[26], // ¿Qué deporte practicas?
      QUESTIONS_DATA[27], // ¿Qué tienes en tu habitación?
      QUESTIONS_DATA[28], // ¿Qué haces cuando estás cansado?
      QUESTIONS_DATA[29], // ¿Qué haces antes de salir de casa?
      QUESTIONS_DATA[30]  // ¿Qué haces si no entiendes algo?
    ]
  }
];
