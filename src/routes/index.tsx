import { component$, Resource, useResource$ } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";
import "./list.css";
import "./recipe.css";

interface RecipeListData {
  data: {
    recipe: [
      {
        id: string;
        data: {
          name: string;
        };
      }
    ];
  };
}

export const RECIPE_LIST_QUERY = `query ListRecipes {
	recipe {
    id
    data {
      name
    }
  }
}`;

export default component$(() => {
  const recipeListResource = useResource$<RecipeListData>(
    async ({ track, cleanup }) => {
      const controller = new AbortController();
      cleanup(() => controller.abort());

      const url = new URL(
        `https://cdn.builder.io/api/v1/graphql/ec31c5156fa0412aa49dd7eb67dcee5f`
      );
      url.searchParams.append("query", RECIPE_LIST_QUERY);

      console.log("FETCH", url.toString());
      const start = process.hrtime.bigint();

      const response = await fetch(url, {
        signal: controller?.signal,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("FETCH resolved");
      console.log(`took ${Number(process.hrtime.bigint() - start) / 1e6}ms`);

      return await response.json();
    }
  );

  return (
    <main>
      <section class="center">
        <h1>Recipes</h1>

        <Resource
          value={recipeListResource}
          // FIXME: Enable this after https://github.com/BuilderIO/qwik/issues/1526
          // onPending={() => <div>Loading...</div>}
          onRejected={() => <div>Error</div>}
          onResolved={(recipes) => (
            <ul>
              {recipes.data.recipe.map((recipe) => (
                <li>
                  <a href={`recipes/${recipe.id}`}>{recipe.data.name}</a>
                </li>
              ))}
            </ul>
          )}
        />
      </section>
    </main>
  );
});

export const head: DocumentHead = {
  title: "Recipes",
};
