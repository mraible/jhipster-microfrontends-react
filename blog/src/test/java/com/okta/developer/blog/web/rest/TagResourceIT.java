package com.okta.developer.blog.web.rest;

import com.okta.developer.blog.BlogApp;
import com.okta.developer.blog.config.TestSecurityConfiguration;
import com.okta.developer.blog.domain.Tag;
import com.okta.developer.blog.repository.TagRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import javax.persistence.EntityManager;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link TagResource} REST controller.
 */
@SpringBootTest(classes = { BlogApp.class, TestSecurityConfiguration.class })
@AutoConfigureMockMvc
@WithMockUser
public class TagResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    @Autowired
    private TagRepository tagRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTagMockMvc;

    private Tag tag;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Tag createEntity(EntityManager em) {
        Tag tag = new Tag()
            .name(DEFAULT_NAME);
        return tag;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Tag createUpdatedEntity(EntityManager em) {
        Tag tag = new Tag()
            .name(UPDATED_NAME);
        return tag;
    }

    @BeforeEach
    public void initTest() {
        tag = createEntity(em);
    }

    @Test
    @Transactional
    public void createTag() throws Exception {
        int databaseSizeBeforeCreate = tagRepository.findAll().size();
        // Create the Tag
        restTagMockMvc.perform(post("/api/tags").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(tag)))
            .andExpect(status().isCreated());

        // Validate the Tag in the database
        List<Tag> tagList = tagRepository.findAll();
        assertThat(tagList).hasSize(databaseSizeBeforeCreate + 1);
        Tag testTag = tagList.get(tagList.size() - 1);
        assertThat(testTag.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    public void createTagWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = tagRepository.findAll().size();

        // Create the Tag with an existing ID
        tag.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restTagMockMvc.perform(post("/api/tags").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(tag)))
            .andExpect(status().isBadRequest());

        // Validate the Tag in the database
        List<Tag> tagList = tagRepository.findAll();
        assertThat(tagList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = tagRepository.findAll().size();
        // set the field null
        tag.setName(null);

        // Create the Tag, which fails.


        restTagMockMvc.perform(post("/api/tags").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(tag)))
            .andExpect(status().isBadRequest());

        List<Tag> tagList = tagRepository.findAll();
        assertThat(tagList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllTags() throws Exception {
        // Initialize the database
        tagRepository.saveAndFlush(tag);

        // Get all the tagList
        restTagMockMvc.perform(get("/api/tags?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(tag.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }
    
    @Test
    @Transactional
    public void getTag() throws Exception {
        // Initialize the database
        tagRepository.saveAndFlush(tag);

        // Get the tag
        restTagMockMvc.perform(get("/api/tags/{id}", tag.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(tag.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }
    @Test
    @Transactional
    public void getNonExistingTag() throws Exception {
        // Get the tag
        restTagMockMvc.perform(get("/api/tags/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateTag() throws Exception {
        // Initialize the database
        tagRepository.saveAndFlush(tag);

        int databaseSizeBeforeUpdate = tagRepository.findAll().size();

        // Update the tag
        Tag updatedTag = tagRepository.findById(tag.getId()).get();
        // Disconnect from session so that the updates on updatedTag are not directly saved in db
        em.detach(updatedTag);
        updatedTag
            .name(UPDATED_NAME);

        restTagMockMvc.perform(put("/api/tags").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedTag)))
            .andExpect(status().isOk());

        // Validate the Tag in the database
        List<Tag> tagList = tagRepository.findAll();
        assertThat(tagList).hasSize(databaseSizeBeforeUpdate);
        Tag testTag = tagList.get(tagList.size() - 1);
        assertThat(testTag.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    public void updateNonExistingTag() throws Exception {
        int databaseSizeBeforeUpdate = tagRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTagMockMvc.perform(put("/api/tags").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(tag)))
            .andExpect(status().isBadRequest());

        // Validate the Tag in the database
        List<Tag> tagList = tagRepository.findAll();
        assertThat(tagList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteTag() throws Exception {
        // Initialize the database
        tagRepository.saveAndFlush(tag);

        int databaseSizeBeforeDelete = tagRepository.findAll().size();

        // Delete the tag
        restTagMockMvc.perform(delete("/api/tags/{id}", tag.getId()).with(csrf())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Tag> tagList = tagRepository.findAll();
        assertThat(tagList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
