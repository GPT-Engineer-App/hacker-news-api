import React, { useEffect, useState } from "react";
import { Container, Text, VStack, Box, Heading, Link, Spinner, Flex } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";

const Index = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopStories = async () => {
      try {
        const response = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
        const storyIds = await response.json();
        const top10StoryIds = storyIds.slice(0, 10);

        const storyPromises = top10StoryIds.map(async (id) => {
          const storyResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
          return await storyResponse.json();
        });

        const stories = await Promise.all(storyPromises);
        setStories(stories);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching top stories:", error);
        setLoading(false);
      }
    };

    fetchTopStories();
  }, []);

  return (
    <Container maxW="container.lg" p={4}>
      <Box as="nav" bg="brand.800" color="white" p={4} mb={6}>
        <Heading as="h1" size="lg">Hacker News</Heading>
      </Box>
      {loading ? (
        <Flex justify="center" align="center" height="50vh">
          <Spinner size="xl" />
        </Flex>
      ) : (
        <VStack spacing={4} align="stretch">
          {stories.map((story) => (
            <Box key={story.id} p={4} borderWidth="1px" borderRadius="md">
              <Heading as="h2" size="md">
                <Link href={story.url} isExternal>
                  {story.title} <ExternalLinkIcon mx="2px" />
                </Link>
              </Heading>
              <Text>by {story.by}</Text>
              <Text>{new Date(story.time * 1000).toLocaleString()}</Text>
            </Box>
          ))}
        </VStack>
      )}
    </Container>
  );
};

export default Index;