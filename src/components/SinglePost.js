import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import sanityClient from "../client.js";
import imageUrlBuilder from "@sanity/image-url";
import BlockContent from "@sanity/block-content-to-react";

const builder = imageUrlBuilder(sanityClient);
function urlFor(source){
  return builder.image(source);
}

export default function SinglePost() {
  const [singlePost, setSinglePost] = useState(null);
  const { slug } = useParams();

  useEffect(() => {
    sanityClient.fetch(`*[slug.current == "${slug}"]{
      title,
      _id,
      slug,
      mainImage{
        asset->{
          _id,
          url
        }
      },
      body,
      "name": author->name,
      "authorImage": author->image
    }`).then((data) => setSinglePost(data[0]))
    .catch(console.error);
  }, [slug]);

  if( !singlePost ) return <div> Loading... </div>;

  return (
    <main>
      <article>
        <header>
          <div>
            <div>
              <h1>{singlePost.title}</h1>
              <div><img src={urlFor(singlePost.authorImage).url()} alt={singlePost.name} /></div>
              <p>{singlePost.name}</p>
            </div>
          </div>
          <img src={singlePost.mainImage.asset.url} alt={singlePost.title} />
        </header>
        <div>
          <BlockContent blocks={singlePost.body} projectId="t9i8pgai" dataset="production" />
        </div>
      </article>
    </main>
  );

}