import { DocumentHead } from "@builder.io/qwik-city";
import {
  Resource,
  component$,
  useResource$,
  useStylesScoped$,
} from "@builder.io/qwik";

interface RecipeData {
  data: {
    oneRecipe: {
      id: string;
      data: {
        name: string;
        description: string;
        ingredientGroup: Array<{
          ingredients: Array<{ ingredient: string }>;
        }>;
        instructions: Array<{
          instruction: string;
        }>;
      };
    };
  };
}

export const GET_RECIPE_QUERY = `query GetRecipe {
  oneRecipe(query: {id: "8bfd397055d34749abcc8a944e2909db"}) {
    id
    data {
      name
      description
      ingredientGroup
      instructions
    }
  }
}`;

export default component$(() => {
  const recipeData = useResource$<RecipeData>(async ({ track, cleanup }) => {
    const controller = new AbortController();
    cleanup(() => controller.abort());

    const url = new URL(
      `https://cdn.builder.io/api/v1/graphql/ec31c5156fa0412aa49dd7eb67dcee5f`
    );
    url.searchParams.append("query", GET_RECIPE_QUERY);

    console.log("FETCH", url.toString());
    const start = process.hrtime.bigint();

    const response = await fetch(url, {
      signal: controller?.signal,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(
      `FETCH resolved in ${Number(process.hrtime.bigint() - start) / 1e6}ms`
    );
    return await response.json();
  });

  useStylesScoped$(`
  header {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  header img {
    width: 100%;
    height: auto;
  }

  .description {
    padding: 1em;
    text-align: center;
    width: 50%;
  }

  h1 {
    padding: 0.8em;
  }

  h1,
  h2,
  h3 {
    font-family: "Circular Std";
  }

  .ingredients-list h2 {
    font-size: 1em;
    font-weight: 300;
  }

  .ingredients-list h3 {
    padding-top: 1em;
    font-size: 0.8em;
    font-weight: 300;
    text-transform: uppercase;
  }

  h2 {
    font-size: 1em;
  }

  ul {
    list-style: none;
    padding-left: 0;
  }

  .ingredients-box {
    display: flex;
    justify-content: center;
    background-color: #f8f8f8;
  }

  .ingredients-list {
    margin: 2em;
    width: 66%;
  }

  .instructions-box {
    display: flex;
  }

  .instructions {
    margin: 2em;
    max-width: 60%;
  }

  .instructions p {
    font-size: 1em;
    line-height: 1.6em;
  }

  .instructions .side-note {
    position: absolute;
    right: 0;
    width: 20%;
    font-size: 0.75em;
    background-color: #f8f8f8;
    padding: 1em;
    margin: 1em;
  }`);

  return (
    <Resource
      value={recipeData}
      // FIXME: Enable this after https://github.com/BuilderIO/qwik/issues/1526
      // onPending={() => <div>Loading...</div>}
      onRejected={() => <div>Error</div>}
      onResolved={(result) => {
        const recipe = result.data.oneRecipe.data;
        return (
          <>
            <header>
              <h1>{recipe.name}</h1>
              <p class="description">{recipe.description}</p>
            </header>
            <div class="ingredients-box">
              <div class="ingredients-list">
                <h2>INGREDIENTS</h2>

                {recipe.ingredientGroup.map((ig) => (
                  <ul>
                    {ig.ingredients.map((i) => (
                      <li>{i.ingredient}</li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>

            <div class="instructions-box">
              <div class="instructions">
                <h2>Instructions</h2>

                {recipe.instructions.map((i) => (
                  <p>{i.instruction}</p>
                ))}
              </div>
            </div>
          </>
        );
      }}
    />
  );
});

export const head: DocumentHead = {
  title: "Recipe",
};
